# 📘 PaperWallah (Nexus-Frontend)

PaperWallah is a web platform that helps students access **previous year exam papers (PYQs)** easily.  
It provides a clean frontend to browse subjects, semesters, and branches, powered by a simple **Excel → JSON** conversion pipeline.

🔗 Live Demo: [paperwallah.vercel.app](https://paperwallah.vercel.app/)

---

## 🚀 Features
- Convert Excel sheets containing exam paper details into JSON with a simple Python script.
- Browse and download PYQs by **subject, semester, branch, and year**.
- Easy-to-navigate frontend with:
  - **Home Page**
  - **Exam Vault Page**
- Deployed on **Vercel** for fast and reliable access.

---

## 📂 Excel Format

Your `input.xlsx` must follow this structure:

| Timestamp           | Subject Code | Subject Name           | Type     | Semester | Year | Branch | PYQ pdf                                                     | Branch with same PYQ |
|---------------------|--------------|------------------------|----------|----------|------|--------|-------------------------------------------------------------|----------------------|
| 9/15/2025 19:07:37  | CS101        | COMPUTER PROGRAMMING   | End Sem  | 1        | 2023 | MAE    | https://drive.google.com/open?id=1LmS9HuBNCn5ca2CR7fVrAbm9QDnmqGl8 |                      |
| 9/15/2025 19:07:37  | CS101        | COMPUTER PROGRAMMING   | End Sem  | 1        | 2023 | ECE    | https://drive.google.com/open?id=1LmS9HuBNCn5ca2CR7fVrAbm9QDnmqGl8 |                      |

---

## 🧰 Usage

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd Nexus-Frontend
```

### 2. Convert Excel → JSON
Inside the `public/` folder, run:
```powershell
python .\excel_to_json.py .\data\input.xlsx .\data\examPapers.json
```

This will read `input.xlsx` and create `examPapers.json`.

### 3. Run the frontend
If using Vite + React:
```sh
npm install
npm run dev
```
Then visit `http://localhost:5173`.

---

## 🖼️ Screenshots

### 🏠 Home Page
![Home Page](./screenshots/home.png)

### 📚 Exam Vault
![Exam Vault](./screenshots/examvault.png)

> Place your screenshots inside a `screenshots/` folder in the repo.

---

## 🧩 Tech Stack
- **Python** (Excel → JSON conversion)
- **React + Vite** (Frontend)
- **JSON** (Data storage)
- **Vercel** (Deployment)

---

## 📦 Deployment
- Hosted on [Vercel](https://vercel.com/)  
- Push to `main` branch → auto deploys to [paperwallah.vercel.app](https://paperwallah.vercel.app/)

---

## ✅ To-Do / Improvements
- Add **upload feature** so admins can directly upload Excel from UI.
- Implement **search & filters** in Exam Vault.
- Improve **mobile responsiveness**.
- Add **pagination** for large sets of papers.

---

## 👨‍💻 Contributors
- **Ayush Srivastava** (Maintainer)

---

## 📜 License
MIT License  
See [LICENSE](./LICENSE) file for details.

---

# ⚛️ React + Vite

This project is bootstrapped with **React + Vite**.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

---

## 🔧 Expanding the ESLint configuration

If you are developing a production application, we recommend using **TypeScript** with type-aware lint rules enabled.  
Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
