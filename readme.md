# Emiler

**Emiler** is a full-stack project with an **Email Engine backend** and a **Next.js frontend**. It allows users to generate, manage, and send emails efficiently. The backend is powered by Python (FastAPI/Email Engine), while the frontend uses React with Next.js.

---

## Project Structure

```
emiler/
│
├── email_engine/           # Backend folder
│   ├── __init__.py
│   ├── csv_loader.py       # Loads data from CSV
│   ├── email_generator.py  # Generates email content
│   ├── sendgrid_sender.py  # Sends emails via SendGrid
│   ├── template_engine.py  # Renders email templates
│   ├── schema.py           # Pydantic models for API validation
│   ├── pyproject.toml      # Dependency configuration
│   └── uv.lock             # Lock file for dependencies
│
├── nextjs-web/             # Frontend folder
│   ├── package.json        # Frontend dependencies
│   ├── src/
│   │   ├── app/            # Pages and layouts
│   │   ├── components/     # Reusable UI components
│   │   └── styles/         # CSS/Styling
│   └── ...                 # Other Next.js files
│
└── README.md               # This file
```

---

## Prerequisites

Before running the project, make sure you have:

- **Python 3.9+**  
- **Node.js and npm**  
- **Uvicorn** for running the backend API:  
  ```bash
  pip install uvicorn
  ```  

---

## Running the Project

### 1. Email Engine Backend

```bash
# Navigate to the backend folder
cd email_engine

# Sync dependencies if using pyproject.toml (poetry or pip)
# Example: poetry install or pip install -r requirements.txt

# Start the backend server
uvicorn email_engine:app --reload
```

- Backend will run at: `http://127.0.0.1:8000/`  
- This API handles email generation and sending.

---

### 2. Next.js Frontend

```bash
# Go back to the project root
cd ..

# Navigate to frontend
cd nextjs-web

# Install dependencies
npm install

# Start the development server
npm run dev
```

- Frontend will run at: `http://localhost:3000/`  
- Make sure the backend is running before using the frontend.

---

## Usage

1. Start the **Email Engine backend**.  
2. Start the **Next.js frontend**.  
3. Access the frontend at `http://localhost:3000/`.  
4. Use the UI to generate, preview, and send emails via the backend.

---

## Notes

- If you are on Windows, Git may show warnings like:  
  ```
  LF will be replaced by CRLF the next time Git touches it
  ```  
  These are **safe to ignore**. They only relate to line endings.

- `node_modules` and `uv.lock` are **not included in Git**. Run `npm install` and sync Python dependencies to use the project.

- To stop servers: Press `Ctrl+C` in the terminal.

---

## Optional Configuration

- `.toml` or lock files can be used to **manage Python dependencies**.  
- You can customize email templates in `email_engine/template_engine.py`.  
- Add API keys (like SendGrid) securely in environment variables.

---

## Author

**Your Name / Team Name**  
- GitHub: [mohsinamir19](https://github.com/mohsinamir19)  
- Project maintained for internal or collaborative use.

---

### ✅ Ready to Use

1. Clone the repo.  
2. Run backend (`email_engine`)  
3. Run frontend (`nextjs-web`)  
4. Start sending and managing emails instantly.
