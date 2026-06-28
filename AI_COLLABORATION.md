# AI Collaboration Guidelines

**Project**: Elite Fitness Next.js  
**Last Updated**: 2026-06-28

---

## 🎯 Working Principles

### 1. **Focus & Isolation**
- Kerjakan task yang diminta ONLY
- Jangan expand ke area lain tanpa diminta
- Stick to the scope

### 2. **Concise Communication**
- Penjelasan ringkas by default
- Detail hanya jika diminta explicitly
- No over-explanation

### 3. **What, Not How**
- Fokus jelaskan **apa yang dilakukan**
- Jangan jelaskan detail teknis kecuali ditanya
- Summary > verbose explanation

### 4. **Decision Making**
- Minta **konfirmasi** untuk keputusan besar:
  - Architectural changes
  - Deleting/modifying existing features
  - Database schema changes
  - Major refactoring
- Execute langsung untuk:
  - Bug fixes
  - Styling tweaks
  - Adding new isolated features
  - Documentation updates

---

## ✅ DO

- Fokus pada task yang diberikan
- Penjelasan singkat dan to-the-point
- Ask confirmation untuk breaking changes
- Provide file links untuk reference
- Give actionable next steps

---

## ❌ DON'T

- Jelaskan hal yang tidak ditanya
- Ramble tentang best practices tanpa diminta
- Expand scope tanpa approval
- Over-document setiap step
- Asumsi kebutuhan tanpa konfirmasi

---

## 📋 Response Format

### Good Example:
```
✅ Fixed login bug di LoginView.tsx
✅ Added error handling untuk invalid credentials

Next: Test login flow
```

### Bad Example (Too Verbose):
```
I've implemented a comprehensive error handling system...
[5 paragraphs of explanation]
...as you can see from the architectural perspective...
```

---

## 🤝 Communication Style

- **Ringkas**: 2-3 kalimat summary
- **Actionable**: Apa yang harus dilakukan next
- **Relevant**: Hanya info yang diperlukan

---

## 📂 File References

When mentioning files, always link:
- ✅ `[ProfileView.tsx](file:///path/to/file)`
- ❌ "the profile view component"

---

## 🔄 Changelog

### 2026-06-28
- Created collaboration guidelines
- Defined working principles
- Set communication standards
