function getCookie(a) {
  const b = `; ${document.cookie}`,
    c = b.split(`; ${a}=`);
  if (2 === c.length) return c.pop().split(";").shift();
}
function sleep(a) {
  return new Promise((b) => {
    setTimeout(b, a);
  });
}
function afterUrlGenerator(a) {
  return `https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24","after":"${a}"}`;
}
function unfollowUserUrlGenerator(a) {
  return `https://www.instagram.com/web/friendships/${a}/unfollow/`;
}
let followedPeople,
  csrftoken = getCookie("csrftoken"),
  ds_user_id = getCookie("ds_user_id"),
  initialURL = `https://www.instagram.com/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables={"id":"${ds_user_id}","include_reel":"true","fetch_mutual":"false","first":"24"}`,
  doNext = !0,
  filteredList = [],
  getUnfollowCounter = 0,
  scrollCicle = 0;
startScript();
async function startScript() {
  var a = Math.floor;
  for (; doNext; ) {
    let b;
    try {
      b = await fetch(initialURL).then((a) => a.json());
    } catch (a) {
      continue;
    }
    followedPeople || (followedPeople = b.data.user.edge_follow.count),
      (doNext = b.data.user.edge_follow.page_info.has_next_page),
      (initialURL = afterUrlGenerator(
        b.data.user.edge_follow.page_info.end_cursor
      )),
      (getUnfollowCounter += b.data.user.edge_follow.edges.length),
      b.data.user.edge_follow.edges.forEach((a) => {
        a.node.follows_viewer || filteredList.push(a.node);
      }),
      console.clear(),
      console.log(
        `%c İLERLEME ${getUnfollowCounter}/${followedPeople} (${parseInt(
          100 * (getUnfollowCounter / followedPeople)
        )}%)`,
        "background: #222; color: #bada55;font-size: 35px;"
      ),
      console.log(
        `%c Bu kullanıcılar sizi takip etmiyor (Hala devam ediyor) ⏱`,
        "background: #222; color: #FC4119;font-size: 13px;"
      ),
      filteredList.forEach((a) => {
        console.log(a.username);
      }),
      await sleep(a(400 * Math.random()) + 1e3),
      scrollCicle++,
      6 < scrollCicle &&
        ((scrollCicle = 0),
        console.log(
          `%c Geçici banlamayı önlemek için 10 saniye ara verildi ⏳`,
          "background: #222; color: ##FF0000;font-size: 35px;"
        ),
        await sleep(1e4));
  }
  if (
    (console.clear(),
    console.log(
      `%c ${filteredList.length} kullanıcı seni geri takip etmiyor 😔`,
      "background: #222; color: #bada55;font-size: 25px;"
    ),
    filteredList.forEach((a) => {
      console.log(a.username);
    }),
    (wantUnfollow = confirm("Listelenen tüm kullanıcılar takipten çıkarılsın mı? 🥳")),
    wantUnfollow)
  ) {
    let b = 0;
    unfollowSleepCounter = 0;
    for (const c of filteredList) {
      try {
        await fetch(unfollowUserUrlGenerator(c.id), {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            "x-csrftoken": csrftoken,
          },
          method: "POST",
          mode: "cors",
          credentials: "include",
        });
      } catch (a) {}
      await sleep(a(2000 * Math.random()) + 4e3),
        b++,
        unfollowSleepCounter++,
        5 <= unfollowSleepCounter &&
          (console.log(
            `%c Geçici banlamayı önlemek için 5 dakika ara verildi ⏳`,
            "background: #222; color: ##FF0000;font-size: 35px;"
          ),
          (unfollowSleepCounter = 0),
          await sleep(3e5)),
        console.log(`Takip bırakıldı: ${b}/${filteredList.length}`);
    }
    console.log(
      `%c TAMAMLANDI! 🚀`,
      "background: #222; color: #bada55;font-size: 25px;"
    );
  } else
    console.log(
      `%c TAMAMLANDI! 🚀`,
      "background: #222; color: #bada55;font-size: 25px;"
    );
}