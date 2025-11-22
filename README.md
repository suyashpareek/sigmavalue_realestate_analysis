# sigmavalue_realestate_analysis
How to Run the Project
Backend (Django)
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver


Backend will run at:

http://127.0.0.1:8000/


API Endpoint:

POST /api/analyze/


Form-Data:

query: "Wakad"

file: (optional Excel .xlsx)

2️⃣ Frontend (React)
cd frontend
npm install
npm run dev


Frontend will run at:

http://127.0.0.1:5173/

Project Structure
IntViz/
 ├── backend/
 │    ├── api/
 │    │    └── views.py
 │    ├── backend/
 │    │    └── settings.py
 │    ├── requirements.txt
 │    └── manage.py
 │
 └── frontend/
      ├── src/
      │    ├── App.jsx
      │    └── components/
      │         └── ChatUI.jsx
      └── vite.config.js
