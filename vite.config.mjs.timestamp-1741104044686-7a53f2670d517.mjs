// vite.config.mjs
import { defineConfig } from "file:///C:/Users/valen/Desktop/ZavrsniV2/node_modules/vite/dist/node/index.js";
import solidPlugin from "file:///C:/Users/valen/Desktop/ZavrsniV2/node_modules/vite-plugin-solid/dist/esm/index.mjs";
import basicSsl from "file:///C:/Users/valen/Desktop/ZavrsniV2/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    solidPlugin(),
    basicSsl({
      /** name of certification */
      name: "test",
      /** custom trust domains */
      domains: ["*.custom.com"],
      /** custom certification directory */
      certDir: "/Users/.../.devServer/cert"
    })
  ],
  server: {
    port: 3e3
  },
  build: {
    target: "esnext"
  },
  base: process.env.NODE_ENV === "production" ? "/ZavrsniV2/" : "/"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdmFsZW5cXFxcRGVza3RvcFxcXFxaYXZyc25pVjJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXHZhbGVuXFxcXERlc2t0b3BcXFxcWmF2cnNuaVYyXFxcXHZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvdmFsZW4vRGVza3RvcC9aYXZyc25pVjIvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBzb2xpZFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1zb2xpZCc7XHJcbmltcG9ydCBiYXNpY1NzbCBmcm9tICdAdml0ZWpzL3BsdWdpbi1iYXNpYy1zc2wnXHJcbi8vIGltcG9ydCBkZXZ0b29scyBmcm9tICdzb2xpZC1kZXZ0b29scy92aXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgc29saWRQbHVnaW4oKSxcclxuICAgIGJhc2ljU3NsKHtcclxuICAgICAgLyoqIG5hbWUgb2YgY2VydGlmaWNhdGlvbiAqL1xyXG4gICAgICBuYW1lOiAndGVzdCcsXHJcbiAgICAgIC8qKiBjdXN0b20gdHJ1c3QgZG9tYWlucyAqL1xyXG4gICAgICBkb21haW5zOiBbJyouY3VzdG9tLmNvbSddLFxyXG4gICAgICAvKiogY3VzdG9tIGNlcnRpZmljYXRpb24gZGlyZWN0b3J5ICovXHJcbiAgICAgIGNlcnREaXI6ICcvVXNlcnMvLi4uLy5kZXZTZXJ2ZXIvY2VydCdcclxuICAgIH0pXHJcbiAgXSxcclxuICBzZXJ2ZXI6IHtcclxuICAgIHBvcnQ6IDMwMDAsXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICB9LFxyXG4gIGJhc2U6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSBcInByb2R1Y3Rpb25cIiA/IFwiL1phdnJzbmlWMi9cIiA6IFwiL1wiXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThSLFNBQVMsb0JBQW9CO0FBQzNULE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sY0FBYztBQUdyQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxZQUFZO0FBQUEsSUFDWixTQUFTO0FBQUE7QUFBQSxNQUVQLE1BQU07QUFBQTtBQUFBLE1BRU4sU0FBUyxDQUFDLGNBQWM7QUFBQTtBQUFBLE1BRXhCLFNBQVM7QUFBQSxJQUNYLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLE1BQU0sUUFBUSxJQUFJLGFBQWEsZUFBZSxnQkFBZ0I7QUFDaEUsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
