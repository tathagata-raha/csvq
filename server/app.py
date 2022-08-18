
from gettext import find
import json
import re
from flask import Flask, request, render_template, jsonify, send_file
import random, string
from pandasql import sqldf
from datetime import datetime
import pandas as pd
import os
from os import listdir, scandir, remove
from flask_cors import CORS
import numpy as np
import requests
from collections import Counter
from werkzeug.utils import secure_filename

# from tableqa.agent import Agent
# import os
# os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'


app = Flask(__name__)
CORS(app)

filenames = {"ipl_match":"db/ipl_data/IPL Matches 2008-2020.csv","ipl_ball":"db/ipl_data/IPL Ball-by-Ball 2008-2020.csv","patient1":"db/medical/411_patient_data.csv", "cancer1":"db/medical/Cancer.csv"}
hashmaps = {}

def find_csv_filenames(path_to_dir, suffix=".csv" ):
    file_ext = listdir(path_to_dir)
    return [[name for name, path in filenames.items() if path == path_to_dir+"/"+filename] for filename in file_ext if filename.endswith( suffix )]

def find_filename(name,domain):
    print (name)
    if ("Table_" in name):
        return "db/"+domain+"/"+name+".csv"
    else:
        return filenames[name]

@app.route('/')
def get_root():
    return "Hello"

@app.route('/docs')
def get_docs():
    return render_template('swaggerui.html')

@app.route('/list_domains',methods=["POST"])
def list_folders():
    data = request.get_json()
    folder = data["domain"]
    subfolders = [ f.name for f in scandir(folder) if f.is_dir() ]
    response_list = []
    for i in subfolders:
        response_list.append({"value":i,"name":i})
    return jsonify({"folders":response_list}),200

@app.route('/list_csv',methods=["POST"])
def list_csv():
    data = request.get_json()
    db = data["folder"]
    csvs = find_csv_filenames(db)
    response_list = []
    for i in csvs:
        response_list.append({"value":i,"name":i})
    return jsonify({"files":response_list}),200

@app.route('/set_map',methods=["POST"])
def set_map():
    global hashmaps
    data = request.get_json()
    hsh = data["str"]
    file = data["file"]
    hashmaps[hsh] = file
    return jsonify({}),200


@app.route('/start_download/',methods=["GET"])
def trigger_download():
    hashstr = request.args.get('str')
    print (request.args)
    print (hashstr)
    csvfile = hashmaps[hashstr]
    print (csvfile)
    return send_file(csvfile, mimetype='text/csv', attachment_filename='output.csv',as_attachment=True)



@app.route("/sql_query", methods=["POST"])
def run_sql():
    data = request.get_json()  # parse as JSON
    query = data["query"]
    files = data["files"]
    domain_name = data["domain"]
    query_index = data["q_index"]
    query_type = data["query_type"]
    file_map = {}
    for file in files:
        rand_name = ''.join(random.choices(string.ascii_lowercase, k = 4))
        file_map[file] = rand_name
        query_prev = query
        query = query.replace(file,rand_name)
        exec(rand_name+" = pd.read_csv(\""+find_filename(file,domain_name)+"\")",globals())
    mysql = lambda q: sqldf(q, globals())
    try:
        output = mysql(query)
        output_name = "db/"+str(domain_name)+"/Table_"+str(query_index)
        output = output.drop(['Unnamed: 0'], axis=1, errors='ignore')
        if (query_type==1):
            output.to_csv(output_name+".csv")
        output = output.head()
        rows =[]
        def npencoder(obj):
            if isinstance(obj, np.integer):
                return int(obj)
            if isinstance(obj, np.floating):
                return float(obj)
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            return obj
        
        for index, row in output.iterrows():
            my_list = list(row.values)
            for i in range(len(my_list)):
                my_list[i] = npencoder(my_list[i])

            rows.append(my_list)
        
        cols = output.columns.values.tolist()
        result = output.to_json()
        if len(files) < 2 and not files[0].startswith('Table_'):
            with open("queries/" + files[0], "a+") as f:
                f.write(query_prev.lower()+"\n")
        return jsonify({"thead":cols,"tbodys":rows}),200
    except Exception as e:
        e = str(e)
        e = e.split("\n",2)[0]
        return jsonify({"error":str(e)}),200


@app.route("/clear", methods=["POST"])
def clear_csv():
    data = request.get_json()
    db = "db/"
    csvs = [os.path.join(dp, f) for dp, dn, filenames in os.walk(db) for f in filenames if os.path.splitext(f)[1] == '.csv']
    print (csvs)
    for i in csvs:
        filename = i
        print (filename)
        if ("Table_" in i and os.path.exists(filename)):
            remove(filename)
    return jsonify({}),200

@app.route("/datatype", methods=["POST"])
def datatype_db():
    data = request.get_json()  # parse as JSON
    file = data["file"]
    domain = data["domain"]
    df = pd.read_csv(find_filename(file,domain))
    output = df.dtypes
    print(output)
    rows =[]
    for index, value in output.items():
        my_list = list([str(index), str(value)])
        rows.append(my_list)
    cols = ["Column", "Data type"]
    return jsonify({"thead":cols,"tbodys":rows}),200

@app.route("/sugggestions", methods=["POST"])
def suggest():
    data = request.get_json()  # parse as JSON
    files = data["files"][0]
    data = []
    for i in files:
        try:
            with open("queries/" + i, "r+") as f:
                data += f.read().split("\n")[:-1]
        except:
            continue
    coun = Counter(data)
    return jsonify({"sug":coun.most_common(5)}),200

@app.route("/datatype_col", methods=["POST"])
def datatype_col():
    data = request.get_json()  # parse as JSON
    file = data["file"]
    col = data["col"]
    domain = data["domain"]
    df = pd.read_csv(find_filename(file,domain))
    dtyp = str(df.dtypes[col])
    return jsonify([dtyp]),200

@app.route("/preview", methods=["POST"])
def preview_db():
    data = request.get_json()  # parse as JSON
    print ("data:",data)
    file = data["file"]
    df = pd.read_csv(find_filename(file))
    output = df.head()
    rows =[]
    for index, row in output.iterrows():
        my_list = list(row.values)
        rows.append(my_list)
    cols = output.columns.values.tolist()
    # print (cols)
    return jsonify({"thead":cols,"tbodys":rows}),200

# @app.route("/nlu",methods=["POST"])
# def nlp_query():
    # return jsonify({}),200
    
@app.route("/filter", methods=["POST"])
def run_filter():
    data = request.get_json()  # parse as JSON
    file = data["file"]
    print (file)
    cql = data["cql"]
    domain = data["domain"]
    query_index = data["q_index"]
    def change_query(cql):
        cql = re.sub(r'EQUAL_TO', '==', cql)
        cql = re.sub(r'LESS_THAN', '<', cql)
        cql = re.sub(r'GREATER_THAN', '>', cql)
        cql = re.sub(r'GREATER_OR_EQUAL_TO', '>=', cql)
        cql = re.sub(r'LESS_OR_EQUAL_TO', '<=', cql)
        cql = re.sub(r'NOT_EQUAL_TO', '!=', cql)
        cql = re.sub(r'AND', '&', cql)
        cql = re.sub(r'OR', '|', cql)
        cql = re.sub(r' IN \[ ', '.isin([', cql)
        cql = re.sub(r'\]', '])', cql)
        return cql
    df = pd.read_csv(find_filename(file,domain))
    cql = change_query(cql)
    output = df.query(cql)
    if (output.shape[0]>0):
        output_name = "db/"+str(domain)+"/Table_"+str(query_index)
        output = output.drop(['Unnamed: 0'], axis=1, errors='ignore')
        output.to_csv(output_name+".csv")
        output = output.head()
        output = output.replace({np.nan: None})

        # print(output)
        rows =[]
        for index, row in output.iterrows():
            my_list = list(row.values)
            rows.append(my_list)
        cols = output.columns.values.tolist()
        result = output.to_json()
        return jsonify({"thead":cols,"tbodys":rows}),200
    else:
        return jsonify({"error":"Incorrect Filters"}),200
    


@app.route("/nlu", methods=["POST"])
def run_nlp():
    data = request.get_json()  # parse as JSON
    query = data["query"]
    files = data["files"][0][0]
    print(files)
    with open(filenames[files]) as a_file:
        file_dict = {"file": a_file}
    # headers = {'Content-type': 'multipart/form-data'}
        response = requests.post("http://127.0.0.1:10002/set_data", files=file_dict)
        print(response.text)
    # agent = Agent(df)
    # sqlq = agent.get_query(query)
    rdata = {"query": "how many deaths of age below 40 had stomach cancer?"}
    response = requests.post("http://127.0.0.1:10002/query", json = rdata)
    print(response.text)
    q = response.json()['sql_query']
    q = q.replace("dataframe", files)
    return jsonify({"sql_query":q}),200

@app.route("/setdownload", methods=["POST"])
def set_download():
    global dfname
    data = request.get_json()  # parse as JSON
    file = data["file"]
    domain_name = data["domain"]
    dfname = find_filename(file,domain_name)
    return jsonify({"download_set":"Success"}),200
    
@app.route("/download")
def download():
    print(dfname)
    return send_file(dfname, mimetype='text/csv', attachment_filename='output.csv',as_attachment=True)

@app.route("/add_domain", methods=["POST"])
def add_domain():
    data = request.get_json()  # parse as JSON
    domain = data["domain"]
    os.mkdir("db/" + domain)
    return jsonify({"Domain add":"Success"}),200
    # output = df.head()
    # rows =[]
    # for index, row in output.iterrows():
    #     my_list = list(row.values)
    #     rows.append(my_list)
    # cols = output.columns.values.tolist()
    # # print (cols)
    # return jsonify({"thead":cols,"tbodys":rows}),200

@app.route("/setupload", methods=["POST"])
def setupload():
    global uploaddomain
    global uploadnickname
    global uploadfilename
    data = request.get_json()  # parse as JSON
    uploaddomain = data["domain"]
    uploadfilename = data["fname"]
    uploadnickname = data["nickname"]
    return jsonify({"upload_set":"Success"}),200

@app.route("/upload", methods=["POST"])
def upload():
    print(request.files)
    file = request.files['file'] 
    filename = secure_filename(file.filename)
    des = "db/" + uploaddomain + "/" + filename
    file.save(des)
    filenames[uploadnickname] = des
    return jsonify({"upload_set2":"Success"}),200

app.run(use_reloader=True, debug=True, port=5000)
