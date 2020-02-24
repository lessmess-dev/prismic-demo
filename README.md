# Prismic Demo

News feed with live updates demo.

[Website](https://zeit.co/ilyalesik/prismic-demo/4s4satkid)
[Backoffice](https://lesik-test.prismic.io/documents)

## Tech stack:

* [Prismic.io](https://prismic.io/) - headless CMS.
* [Pusher](https://pusher.com/) - Pub/sub service.
* [Zeit Now](https://zeit.co/) - CDN + lambda service.
* [Preact](https://preactjs.com/) - view layer.
* CSS Modules
* Parcel

## How it works

### Live updates

* Frontend subscribes to Pusher updates
* Prismic calls webhook after creating/updating/deleting content
* Webhook URL is our lamda service that send message to Pusher
