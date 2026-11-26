const DISCORD_URL = "https://youtube.com";

document.querySelectorAll("[data-order]").forEach((a) => {
  a.href = DISCORD_URL;
});


document.querySelectorAll(".thumb img").forEach((img) => {
  const hide = () => img.remove();
  img.addEventListener("error", hide);
  if (img.complete && img.naturalWidth === 0) {
    hide();
  }
});
