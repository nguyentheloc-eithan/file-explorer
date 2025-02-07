# OneDrive-like File Explorer Frontend

A modern, fully responsive file explorer application built using **Vite.js**, **TypeScript**, **Material UI**, and **Tailwind CSS**. The application allows users to upload, manage, and interact with files in a sleek and intuitive user interface similar to OneDrive. 

### Key Features:
1. **File Upload & Drag-and-Drop**:
   - Users can drag and drop files onto the main page to upload.
   - A file input button is also available for file selection.
   - Displays an upload progress indicator.
   - Handles errors such as invalid file type or large file size.

2. **File Listing with Table UI**:
   - Uploaded files are displayed in a Material UI table.
   - Table columns include: `File name`, `Size`, `Upload date`, `Actions`.
   - Clicking on a row reveals an action banner with file options.
   - Responsive design ensures the table adjusts for all screen sizes.

3. **Action Banner**:
   - When a row is clicked, an action banner with options like `Download`, `Rename`, `Delete`, and `More` is shown.
   - The banner closes when clicking outside.

4. **State Management & Performance**:
   - Uses React hooks with TypeScript types for state management.
   - Efficient rendering with minimal re-renders to optimize performance.

5. **Styling & UI**:
   - Material UI components for core functionality.
   - Tailwind CSS for layout and utility styling.
   - Smooth animations and transitions ensure a modern, clean design.

6. **Responsiveness & Mobile Support**:
   - Fully responsive for various screen sizes and devices.
   - Mobile-friendly interactions for file management.

7. **Accessibility & UX**:
   - Keyboard navigation support (using arrows, Enter, Delete, etc.).
   - Properly implemented focus states and aria attributes for accessibility.

8. **Performance Optimizations**:
   - Lazy loading for large file lists.
   - Minimizes unnecessary re-renders to improve app performance.

---

## Project Structure

```plaintext
src/
│
├── components/                # Reusable UI components
│   ├── FileTable.tsx           # Table component to display files
│   ├── FileUpload.tsx         # File upload UI (Drag & Drop + Button)
│   ├── ActionBanner.tsx       # Banner for file actions (Download, Rename, Delete)
│   └── FileCard.tsx           # File Card for individual file display
│
├── hooks/                     # Custom hooks for API calls and state management
│   ├── useFileUpload.ts       # Hook for handling file uploads
│   ├── useFileActions.ts      # Hook for handling file actions (Download, Rename, Delete)
│   └── useFileList.ts         # Hook for fetching and managing file list data
│
├── types/                     # TypeScript types and interfaces
│   ├── file.ts                # Types for file data (name, size, etc.)
│   └── api.ts                 # API response types and request interfaces
│
├── services/                  # API services
│   ├── fileService.ts         # API integration for file management (upload, delete, rename)
│
├── App.tsx                    # Main App component
├── index.tsx                  # Entry point of the application
├── vite.config.ts             # Vite.js configuration
└── tailwind.config.js         # Tailwind CSS configuration
```
