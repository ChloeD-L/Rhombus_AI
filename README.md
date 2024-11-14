# Rhombus AI Project

This project consists of a **frontend** built with Next.js (TypeScript) and a **backend** built using Django with SQLite for data storage. The goal of the project is to allow users to upload CSV or Excel files, process the data on the backend, and store both raw and processed data in the database. User authentication is handled using Django’s `TokenAuthentication`, allowing each file upload to be associated with the correct user.

## Project Structure

### Client (Frontend)

The frontend is built using **Next.js** with TypeScript. It includes the following key directories:

- `app/`: Contains main application pages (`dashboard`, `upload`, and `login`).
- `components/`: Reusable UI components (e.g., tables, buttons).
- `context/`: Includes `UserContext.tsx` for managing user authentication state using React Context.
- `hooks/`: Custom React hooks for managing various states.
- `lib/` and `utils/`: Utility functions for API calls (e.g., `api.ts`).
- `public/`: Static assets like images.
- `styles/`: Tailwind CSS configuration files (`globals.css`, `tailwind.config.ts`).
- `next.config.mjs`: Next.js configuration file.

### Server (Backend)

The backend is built using **Django** and uses the default `User` model for user management. Key parts of the backend include:

- `data_processing/`: Main Django app handling file uploads, data processing, and storage.
  - `utils/infer_data_types.py`: Contains functions for inferring and converting data types from the uploaded file.
  - `views.py`: Contains API views for handling file uploads and processing data.
  - `models.py`: Defines `UploadedData` model for storing raw and processed data, linked to a user.
  - `urls.py`: URL routing for API endpoints.
  - `admin.py`: Django admin configuration for managing uploaded data records.
- `settings.py`: Django project settings, including database and installed apps.
- `db.sqlite3`: SQLite database for storing users and uploaded data records.

## Installation

### Prerequisites

- **Node.js** (v18 or above)
- **Python** (v3.13.0 or higher)
- **Django** (v5.1.2)
- **SQLite** (default database for Django)

### 1. Frontend Setup

Navigate to the `client/` folder:

```text
cd client/
npm install
```

Start the Frontend
Run the following command to start the development server:

```
npm install
npm run dev
```

The frontend will be available at http://localhost:3000.

### 2. Backend Setup

Navigate to the `Server/` folder:

Virtual Environment
Set up and activate a Python virtual environment:

```
python3 -m venv rhombusenv
source rhombusenv/bin/activate
pip install -r requirements.txt

```

Migrate Database
Apply the database migrations:

```
python manage.py makemigrations
python manage.py migrate
```

Create Superuser
Create an admin user for accessing the Django admin panel:

```
python manage.py createsuperuser
```

Start the Backend Server
Start the Django development server:

```
python manage.py runserver
```

The backend will be available at http://127.0.0.1:8000.

# Version

- **v1.0.0** - Initial release with basic data processing and dashboard UI.
