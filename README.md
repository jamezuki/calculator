# Sass template

1. Install Sass if you haven't
```
npm install -g sass
```
2. Create package.json 
```
npm init
```
3. Add script to package.json
```
"sass": "sass --style=compressed --no-source-map --watch styles/sass/master.scss styles/master.css"
```
4. Compile with:
```
npm run sass
```