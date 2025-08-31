# Contributing to Kyra

Thank you for your interest in contributing to Kyra! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Provide detailed steps to reproduce the issue
- Include browser console errors if applicable
- Specify your environment (OS, browser, version)

### Suggesting Features
- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Explain the use case and benefits
- Consider if the feature aligns with the project's goals

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm, yarn, or bun
- Modern browser with microphone support

### Local Development
```bash
   # Clone and setup
   git clone https://github.com/yourusername/kyra.git
   cd kyra
npm install

# Start development server
npm run dev

# Run linting
npm run lint

# Type checking
npm run type-check

# Build for production
npm run build
```

## 📝 Coding Standards

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Component Guidelines
- Use functional components with hooks
- Follow React best practices
- Implement proper error boundaries
- Add proper TypeScript types

### File Naming
- Use PascalCase for components: `VoiceOrb.tsx`
- Use camelCase for utilities: `useChatStorage.ts`
- Use kebab-case for CSS files: `voice-orb.css`

## 🧪 Testing

### Manual Testing
- Test on multiple browsers (Chrome, Edge, Safari, Firefox)
- Test responsive design on different screen sizes
- Test voice features with different microphones
- Verify accessibility features

### Automated Testing
- Add unit tests for new features
- Ensure all tests pass before submitting PR
- Maintain good test coverage

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for complex functions
- Document component props and usage
- Update README.md for new features
- Keep CHANGELOG.md updated

### User Documentation
- Update user-facing documentation
- Add screenshots for UI changes
- Provide clear usage examples

## 🚀 Pull Request Process

### Before Submitting
1. Ensure all tests pass
2. Run linting and fix any issues
3. Test your changes thoroughly
4. Update documentation if needed

### PR Description
- Use the [pull request template](.github/pull_request_template.md)
- Describe changes clearly
- Link related issues
- Include screenshots for UI changes

### Review Process
- Address review comments promptly
- Make requested changes
- Ensure CI/CD checks pass
- Maintain clean commit history

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority issues
- `priority: low` - Low priority issues

## 📞 Getting Help

### Questions and Discussions
- Use GitHub Discussions for questions
- Join our community chat (if available)
- Check existing issues and PRs

### Development Help
- Review the codebase
- Check existing documentation
- Ask in issues or discussions

## 🎯 Project Goals

Kyra aims to:
- Provide an intuitive voice-first AI assistant
- Maintain high code quality and performance
- Be accessible to users with different abilities
- Support multiple platforms and browsers
- Foster an open and welcoming community

## 📄 License

By contributing to Kyra, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

---

Thank you for contributing to Kyra! 🎤✨
