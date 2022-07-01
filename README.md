# EnjoyHQ Frontend Coding Challenge

Thank you for your interest in EnjoyHQ. This coding challenge consists of two parts. We don't like puzzles and tricky questions, so we based all tasks on
real-life problems we had to solve when building EnjoyHQ.

## General rules

We estimate that this task should take around 4 hours to complete.

You should use React, Redux when needed and vanilla CSS (no bootstrap). Typescript is not mandatory so it's up to you to decide to use it or not.

Please don't make use of any other libraries or frameworks beside React and Redux (libraries, addons, and tools related to Redux are allowed ie: redux-logger).

We've added a very basic CSS theme. Feel free to use/modify or implement your own theme.

Once your solution is complete, please make sure to:

- document how to get everything running
- zip the whole project directory, including `.git`, we're curious about your commit history
- email it to us

If you have doubts or something is not clear - do not hesitate to ask!

## Instructions

We have prepared a basic FE boilerplate, that will compile Typescript if needed. Feel free to use/modify it and implement on top of it.
After `npm install` just run `npm start` to run the app. You can access WebPack's dev server at

http://localhost:8080

## Task

Consume [The Guardian API](https://open-platform.theguardian.com/documentation/) to build a simple news SPA. Users should be able to:

- Search news and navigate through pages
- Filter news by date and optionally by section
- Sort news by: newest, oldest or relevance

Each news item must contain: title, date, section name, thumbnail and anything else you think it would be usefull for users.

We also want to be able to store a user's previous searches (it should include selected query and selected filters) and display them in our application.

---

Good luck!
