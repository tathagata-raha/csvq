# csvq: Search and filter queries on datasets (CSV)
- An all-inclusive UI-based tool to perform various search and filter queries on csv datasets.
- Can also run SQL queries and natural language queries.
- Can select columns from the active tables and impose conditions to filter them using a simple button-based GUI.


#### HOW TO RUN:

**Locally(for Development)**: 

- Clone the repository, followed by running the backend and the frontend in separate terminal tabs:

```
git clone https://github.com/tathagata-raha/csvq

cd server/

pip install -r requirements.txt

python app.py

cd now-ui-dashboard-react-main/

npm install

npm start

```

**Using Docker**: 

- Clone the repository, followed by starting the docker containers using a single command:

`docker-compose up`

- Head over to http://localhost:3000/admin/sql_query

------

## Features
### Select CSV Dataset and Table to perform queries on

- List available datasets on the Data Foundation server.
- Select datasets to run queries on.
- Select one or multiple CSV tables frmo the chosen datasets. 
	
![Test Image 1](https://i.postimg.cc/dty9m9xr/list-domains-cropped.gif)
![Test Image 2](https://i.postimg.cc/h4HYBhF8/list-csvs-cropped.gif)

### Upload new datasets

- Create new dataset domains
- Upload new CSV datasets

![Test Image 3](https://i.postimg.cc/gkxLWBK6/upload-dataset.gif)

### SQL Queries

The user can enter SQL queries on the selected CSV tables and execute them in browser to yield downloadable outputs. The following features are implemented:
* SQL query validator
* Dataset Preview & Datatype preview for all columns
* Output Preview
* Output Direct Download
* Sharable link for download

![Test Image 4](https://i.postimg.cc/SKPNDmwT/sql-query-preview-dtypes.gif)
![Test Image 5](https://i.postimg.cc/hv6jvc0Q/filters-share.gif)

### Filters

In addition the user can select columns from the active tables and impose conditions to filter them using a simple button-based GUI. 

![Test Image 6](https://i.postimg.cc/q747zm2w/filters-download.gif)

### Natural Language Queries

We run an NLP models to infer SQL queries from natural language text input from the user and execute it similar to the SQL pipeline. Note that this is a Beta feature and needs to be trained on more data for more accurate results. 

![Test Image 7](https://i.postimg.cc/15Gv1HrP/natural-language-query.gif)

## Query Suggestions

We can extract information from the active table in one-click with query suggestions based on your query history. The most frequent historical queries are returned as top suggestions. 

![Test Image 8](https://i.postimg.cc/nrbVf0Vq/sql-query-suggestion.gif)

## Hierarchical Queries

We provide the feature to perform multiple types of queries on the outputs of each query forming a hierarchical query structure. The outputs of the hierarchical queries are saved temporarily for each user session and wiped off at the end of the session.

![Test Image 9](https://i.postimg.cc/Mp6Z7z6B/hierarchical-query.gif)


## API Docs

The API documentation for our application is neatly documented using Swagger UI and can be accessed at: http://localhost:5000/docs

## 🚀 Technology Stack:
- **Frontend**: <img src="https://img.shields.io/badge/react%20-%2320232a.svg?&style=for-the-badge&logo=react&logoColor=%2361DAFB"/> 
- **Backend**: <img src="https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white"/>
- **Version Control**: <img src="https://img.shields.io/badge/git%20-%23F05033.svg?&style=for-the-badge&logo=git&logoColor=white"/> <img src="https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white"/>
- **Deployment**: <img src="https://img.shields.io/badge/docker%20-%230db7ed.svg?&style=for-the-badge&logo=docker&logoColor=white"/> 

Made with ❤️️ as part of Data Foundation Systems course, Spring 2022, IIIT Hyderabad.
