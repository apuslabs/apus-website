export function scrollToAnchor(anchor: string) {
  if (!anchor) return;
  const target = document.querySelector("#" + anchor);
  if (target) {
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - 80,
      behavior: "smooth",
    });
  }
}
