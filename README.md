# fcarriedo personal GitHub pages

Personal GitHub pages repository

## To add a custom domain

Add a `CNAME` file to the root of this directory with the custom domain you
want to map to.

`CNAME` contents (eg.):

```
pacostand.com
```

For details see:

  * https://help.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site
  * https://help.github.com/en/github/working-with-github-pages/about-custom-domains-and-github-pages#using-an-apex-domain-for-your-github-pages-site
  * https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site#configuring-an-apex-domain

## Subfolder and Github pages on projects

Any subfolders within this project will be accessible from your
`username.github.io/subfolder` or, if added a custom domain,
`yourcostomdomain.com/subfolder`.

All your public projects that have a `gh-pages` branch will be exposed as
sufolders on your main `github.io` subdomain. For eg.
`https://github.com/fcarriedo/jquery-blink` everything that is exposed on its
`gh-pages` branch, will be exposed to the web as a subfolder of your subdomain:
`fcarriedo.github.io/jquery-blink/` (or on a custom domain as:
`pacostand.com/jquery-blink`).

## Headers

There currently no way of managing server side headers on Github Pages. You
would have to use another static hosting service that provides that
functionality.
