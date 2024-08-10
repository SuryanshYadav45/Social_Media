/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens:{
        
        'smlg':'750px',
        'moblg':'400px',
        'mobxl':"550px",
        'tabl':'650px',
        'med':"850px",
        'lap':'970px'
      },
      borderWidth: {
        '0.5': '0.5px',
      }
    },
  },
  plugins: [],
}