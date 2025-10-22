# Contributing to Carbon Credit Buyer Marketplace

Thank you for your interest in contributing to the Carbon Credit Buyer Marketplace! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

Before creating an issue, please check if it already exists. When creating a new issue:

1. Use the issue templates provided
2. Provide a clear description of the problem
3. Include steps to reproduce the issue
4. Add relevant screenshots or error messages
5. Specify your environment (OS, browser, Node.js version)

### Suggesting Features

We welcome feature suggestions! When proposing a new feature:

1. Check existing feature requests first
2. Provide a clear description of the feature
3. Explain the use case and benefits
4. Consider implementation complexity
5. Be open to discussion and feedback

### Code Contributions

#### Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/carbon-credit-buyer-marketplace.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `pnpm install`

#### Development Workflow

1. **Make your changes** following our coding standards
2. **Write tests** for new functionality
3. **Update documentation** if needed
4. **Run tests** to ensure everything works: `pnpm test`
5. **Run linting**: `pnpm lint`
6. **Commit your changes** with descriptive commit messages
7. **Push to your fork**: `git push origin feature/your-feature-name`
8. **Create a Pull Request**

#### Coding Standards

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the ESLint configuration
- **Prettier**: Use Prettier for code formatting
- **Naming**: Use descriptive variable and function names
- **Comments**: Add comments for complex logic
- **Testing**: Write tests for new features and bug fixes

#### Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(auth): add login functionality`
- `fix(cart): resolve quantity validation issue`
- `docs(readme): update installation instructions`
- `test(api): add unit tests for purchase endpoint`

#### Pull Request Process

1. **Title**: Use a clear, descriptive title
2. **Description**: Explain what changes you made and why
3. **Testing**: Describe how you tested your changes
4. **Screenshots**: Include screenshots for UI changes
5. **Breaking Changes**: Note any breaking changes
6. **Related Issues**: Link to related issues using `Fixes #123`

### Review Process

1. **Automated Checks**: All PRs must pass automated tests and linting
2. **Code Review**: At least one maintainer will review your PR
3. **Feedback**: Address any feedback or requested changes
4. **Approval**: Once approved, your PR will be merged

## 🛠 Development Setup

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShantanuVr/carbon-credit-buyer-marketplace.git
   cd carbon-credit-buyer-marketplace
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

5. **Run tests**
   ```bash
   pnpm test
   pnpm test:e2e
   ```

### Docker Development

```bash
docker compose up -d
pnpm install
pnpm dev
```

## 📋 Project Structure

```
buyer-marketplace/
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                  # Utilities and configurations
├── tests/               # Test files
├── styles/              # Global styles
└── docs/                # Documentation
```

## 🧪 Testing Guidelines

### Unit Tests
- Write tests for utility functions
- Test component behavior
- Mock external dependencies
- Aim for high test coverage

### E2E Tests
- Test critical user journeys
- Test authentication flows
- Test purchase workflows
- Test responsive design

### Running Tests
```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:coverage
```

## 📚 Documentation

### Code Documentation
- Add JSDoc comments for functions
- Document complex algorithms
- Explain business logic
- Update README for new features

### API Documentation
- Document API endpoints
- Provide example requests/responses
- Explain authentication requirements
- Document error responses

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment**: OS, browser, Node.js version
2. **Steps to Reproduce**: Clear, numbered steps
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Error Messages**: Full error logs

## 💡 Feature Requests

When suggesting features:

1. **Problem**: What problem does this solve?
2. **Solution**: How should it work?
3. **Alternatives**: What other solutions did you consider?
4. **Additional Context**: Any other relevant information

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: support@carbonmarketplace.com

## 🎯 Areas for Contribution

We especially welcome contributions in these areas:

- **UI/UX Improvements**: Better user experience
- **Performance**: Optimize loading times
- **Accessibility**: Improve accessibility features
- **Testing**: Increase test coverage
- **Documentation**: Improve documentation
- **Internationalization**: Add multi-language support
- **Mobile**: Enhance mobile experience

## 📜 Code of Conduct

Please note that this project follows a code of conduct. By participating, you agree to uphold this code:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards other community members

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to climate action through technology! 🌱
