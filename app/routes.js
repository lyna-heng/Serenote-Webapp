import { index, route } from "@react-router/dev/routes";

export default [
  route("/", "routes/layout.jsx", [
    route("journals", "routes/home.jsx"),
    route("journals/:journalId", "routes/journal.jsx"),
    route("stickers", "routes/stickers.jsx"),
    route("explore", "routes/explore.jsx"),
    route("favourites", "routes/favourites.jsx"),
    route("profile", "routes/profile.jsx"),

  ])
]