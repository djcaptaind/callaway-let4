# Instructor Guide

## 1. Uploading to GitHub

1. Open the `callaway-let3` repository.
2. Select **Add file** and then **Upload files**.
3. Upload the contents of this package while preserving the folder structure.
4. Commit the changes.
5. Wait for GitHub Pages to redeploy.

## 2. Main URLs

Homepage:

`https://djcaptaind.github.io/callaway-let3/`

Lesson 1:

`https://djcaptaind.github.io/callaway-let3/units/unit-1/lesson-1.html`

## 3. Adding Lesson 1 to Canvas

1. Open the LET 3 course.
2. Select **Modules**.
3. Open the Week 1 module.
4. Select **+**.
5. Choose **External URL**.
6. Paste the Lesson 1 GitHub Pages URL.
7. Enter `Lesson 1 — Welcome to LET 3`.
8. Select **Load in a new tab** only when Canvas blocks embedded interactive content.
9. Add the item and publish it.

## 4. Creating another lesson

1. Copy `templates/master-lesson-template.html`.
2. Rename the copy, such as `lesson-2.html`.
3. Place it in the correct unit folder.
4. Replace the lesson title, summary, objectives, scenario, quiz, and reflection prompt.
5. Update the previous and next lesson links.
6. Commit the new file to GitHub.

## 5. Updating colors

Open:

`assets/css/academy.css`

The main colors are listed at the top:

- `--cla-blue`
- `--cla-blue-dark`
- `--cla-orange`
- `--cla-orange-dark`

## 6. Replacing the CLA mark with a logo

Replace:

`<div class="brand-mark">CLA</div>`

with:

`<img class="brand-logo" src="PATH-TO-YOUR-LOGO.png" alt="Callaway JROTC logo">`

Then add a logo style in `academy.css`.

## 7. Canvas assignments

The lesson page should introduce instruction and practice. Final graded work should remain in Canvas so grades, due dates, rubrics, and submissions stay inside the official course.
