# Changelog

## [0.4.1] - 2025-04-06

### Changed
- Removed wouter dependency for simpler, more reliable navigation
- Simplified routing architecture to avoid path-to-regexp issues
- Updated sidebar components to use basic state management instead of route-based selection
- Added favicon with pixel art design to match the retro aesthetic

### Fixed
- Resolved application startup timeouts related to routing issues
- Fixed component library exports to work without router dependencies
- Updated PostCSS configuration to ensure nesting plugin runs before Tailwind

## [0.4.0] - 2025-04-06

### Added
- Interactive Code Snippet component with hover effects and syntax highlighting
- Code execution mode with line-by-line execution capability
- Token-based syntax highlighting with retro glow effects
- Line-specific code explanations with tooltips
- Execution animation effects

### Updated
- Enhanced CSS styling with syntax highlighting colors
- Added custom glow effects for better retro aesthetic
- Improved overall component interaction feedback
- Added execution mode for code snippets

## [0.3.1] - 2025-04-06

### Added
- New Terminal component with native React implementation for interactive command-line experience
- Terminal scanline effect for enhanced retro aesthetic
- Command suggestions with tab autocompletion

### Updated
- Added compatibility with React 19 while maintaining support for React 18
- Switched from Anthropic's Claude to Google's Gemini Pro for meme generation functionality

### Fixed
- Corrected PostCSS configuration order to ensure CSS nesting works properly
- Resolved styling issues with nested CSS selectors
- Fixed dimensions handling in terminal component

## [0.3.0] - 2025-02-19

### Updated
- Updated framer-motion to version 12.4.4
- Updated lucide-react to version 0.475.0
- Updated tailwind-merge to version 3.0.1

### Fixed
- Fixed PostCSS nesting configuration for proper CSS nesting support

### Changed
- Refactored CSS nested selectors to follow PostCSS nesting standards
