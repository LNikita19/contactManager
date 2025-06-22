# Contact Manager App

A full-featured contact management app built with React 18, Zustand, React Query, React Hook Form, and Material UI.

 //Master Branch code is available 


## 🧠 Features

- Paginated contact list
- Global search (server-side)
- Show Favourites Only toggle (Zustand)
- View / Add / Edit / Delete contact in modal
- Form validation (email, phone)
- Global loading + error handling (bonus)

## 🚀 Getting Started

```bash
# Clone repo
npm install

# Start frontend
npm run dev

# Start JSON mock server
npm run api
```

Visit [http://localhost:5173](http://localhost:5173)
- API endpoints will be available under `/api` (e.g., `http://localhost:3001/contacts`).


## 🛠 Tech Stack
-**React 18** - Version 18 used of react
--**MUI Library (v5.x)** -for components across app. 
--**• Zustand (v5.x)**  - for client-side UI state 
--**TanStack React Query (v5.x)** - for server-side state management (fetching, mutations, cache) link
--**React Hook Form (v7.x)** - for form handling and validation link
   


## Available Scripts

In the project directory, you can run:

- **Contact Management**: Add, edit, view, and delete contacts
- **Search functionality**: Real-time search with server-side filtering
- **Favorites System**: Mark contacts as favorites and filter by favorites
- **Responsive Design**: Works perfectly on desktop and mobile

- **Modern UI**: Clean, professional interface with Material-UI
- **State Management**: Efficient state management with Zustand and TanStack Query
- **Pagination**: Smooth pagination for large contact lists



## 🎯 Usage

### Adding Contacts
1. Click the "Add Contact" button
2. Fill in the contact information
3. Optionally mark as favorite
4. Click "Create" to save

### Editing Contacts
1. Click on any contact card to open details
2. Click the "Edit" button in the modal
3. Update the information
4. Click "Update" to save changes

### Search and Filter
- Use the search bar to find contacts by name
- Toggle "Show Favourites Only" to filter favorites
- Search is performed server-side with real-time results

### Managing Favorites
- Click the heart icon on any contact card or in the detail modal
- Use the "Show Favourites Only" toggle to filter favorites


## Additionaly i have added loght dark mode in UI also i have added list and card view