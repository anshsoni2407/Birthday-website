const modules = import.meta.glob("./Anuj/*.{jpg,jpeg,png,webp}", {
  eager: true,
});

const images = {};

for (const path in modules) {
  const key = path.split("/").pop().split(".")[0]; // ps1, ps2

  images[key] = modules[path].default;
}

export default images;
