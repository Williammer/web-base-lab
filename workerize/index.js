import greenlet from "./greenlet.my.js";

(async () => {
  let getName = greenlet(async username => {
    let url = `https://api.github.com/users/${username}`;
    let res = await fetch(url);
    let profile = await res.json();
    return profile.name;
  });

  const name = await getName("Williammer");
  console.log("000000 name: ", name);
})();
