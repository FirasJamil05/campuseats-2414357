# Week 1 reflection

Answer each question in 1–3 sentences, in your own words.

1. What is the difference between building a UI imperatively (plain DOM code) and declaratively (React)?

Imperative UI means we manually write code to change elements on the screen. Declarative UI in React means we describe what the UI should look like, and React automatically updates it when data changes.

2. Why must a component name start with a capital letter?

React uses capital letters to identify custom components. Lowercase letters are treated as normal HTML elements, such as <div> or <p>.

3. What does a fragment <>...</> do, and why not just use a <div>?

A fragment allows us to group multiple elements without adding an extra HTML element. Unlike a <div>, it keeps the HTML structure cleaner and avoids unnecessary elements.

4. Name one benefit of splitting the UI into small components.

Small components make the code easier to understand, manage, and reuse. They also make it easier to fix errors without affecting other parts of the UI.