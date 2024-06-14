
# Re![localhost_5173_ (1)](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/9adcd7df-1851-4980-b759-73f051ee7a32)
![localhost_5173_course](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/fbe58ab2-8503-4744-892f-2fcad7b5eaf5)
![localhost_5173_course_1](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/a0b51a71-77b6-486c-9414-6c9cc673627f)
![localhost_5173_exams_1](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/e97bbe13-92d5-4afd-821a-2d72594d7335)
![localhost_5173_ (2)](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/3f912fd2-4102-4b9e-bba8-9bef52c158e1)
![localhost_5173_lesson_1_1](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/dc9f05e5-8ae4-44bb-a83d-c8bff2c261df)
![localhost_5173_lesson_1_1 (1)](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/86650145-1e98-42c3-94f1-960e760fcd04)
![localhost_5173_vocab](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/a3e7cc5a-ef75-4689-bdd2-5e6286544205)
![localhost_5173_exam_questions_12](https://github.com/xuanngoc2k2/fe_doan/assets/92130383/814f883f-a7e3-4418-918c-37ce7ce9f5c2)

act + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
