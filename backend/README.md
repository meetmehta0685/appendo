# FastAPI Backend Setup Instructions

This is the boilerplate backend setup for the college placement portal.

## Setup Instructions

### 1. Initialize Virtual Environment
Navigate to the project directory and create a Python virtual environment:
```bash
cd backend
python3 -m venv venv
```

### 2. Activate the Environment
* **On macOS / Linux**:
  ```bash
  source venv/bin/activate
  ```
* **On Windows**:
  ```bash
  venv\Scripts\activate
  ```

### 3. Install Dependencies
Install all the required python packages from the requirements file:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Run the Uvicorn Server
Launch the development server with hot-reloading enabled:
```bash
uvicorn app.main:app --reload
```

The API documentation will be available interactively at:
* Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* Redoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
