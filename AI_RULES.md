# AI Studio Application Rules

This document outlines the technical stack and specific guidelines for developing and modifying this application.

## Tech Stack Description

*   **Frontend Framework**: React for building dynamic and interactive user interfaces.
*   **Language**: TypeScript for enhanced code quality, type safety, and improved developer experience.
*   **Styling**: Tailwind CSS for a utility-first approach to styling, enabling rapid and consistent UI development with responsive design.
*   **Build Tool**: Vite for a fast development server, optimized builds, and efficient module bundling.
*   **Icons**: Lucide React for a comprehensive and customizable set of SVG icons.
*   **UI Components**: Shadcn/ui and Radix UI for pre-built, accessible, and highly customizable UI components.
*   **Routing**: React Router for declarative client-side routing, managing navigation within the application.
*   **State Management**: React's built-in `useState` and `useMemo` hooks for managing local component state and optimizing performance.

## Library Usage Rules

*   **UI Components**:
    *   **Prioritize Shadcn/ui**: Always try to use components from `shadcn/ui` first. These components are already installed and configured.
    *   **Radix UI for Primitives**: If a specific `shadcn/ui` component is not available or requires deep customization, use `Radix UI` primitives as a foundation.
    *   **Custom Components**: For unique UI elements not covered by `shadcn/ui` or `Radix UI`, create new, small, and focused React components.
*   **Styling**:
    *   **Tailwind CSS Only**: All styling must be implemented using `Tailwind CSS` utility classes. Avoid inline styles or separate CSS files.
*   **Icons**:
    *   **Lucide React**: Use `lucide-react` for all icon needs. Import icons from `components/Icons.tsx` if they are already exposed there, or directly from `lucide-react` if new ones are needed.
*   **Routing**:
    *   **React Router**: Implement all application routing using `React Router`. Keep route definitions within `src/App.tsx`.
*   **File Structure**:
    *   **New Components/Hooks**: Always create new files for new components or hooks. Components should go into `src/components/` and pages into `src/pages/`.
    *   **Small Files**: Aim for component files that are 100 lines of code or less. Refactor larger files into smaller, more manageable components when necessary.
*   **Code Quality**:
    *   **Complete Implementations**: All code changes must be complete, fully functional, and syntactically correct. Avoid placeholders or partial implementations.
    *   **Simplicity**: Focus on simple and elegant solutions. Do not over-engineer features with complex error handling or fallback mechanisms unless explicitly requested.