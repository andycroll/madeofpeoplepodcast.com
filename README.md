# Jekyll Site powered by

For [Jekyll](https://jekyllrb.com) sites using gulp to build CSS & JS.

# Installing for new site

Use the [template features](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-from-a-template) of Github, then customise.

## ...for development

```
git clone git@github.com:andycroll/gulpjekyll.git
cd gulpjekyll
bundle
yarn
```


## Running locally

Run...

```
gulp
```

Browse to:

[localhost:3000](http://localhost:3000/)

If you want to change the JS plugins installed, you'll need to reinstall.


### Included actions

```
gulp js
```

Compiles, minifies and uglifies JS (uncomment for more Bootstrap utils) and copies to jekyll location with a sitemap.

```
gulp css
```

Compiles, minifies and strips CSS (based on `_site` HTML files) and copies to jekyll location.

```
gulp jekyll
```

Runs a full `jekyll b`.
