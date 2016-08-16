module.exports = {
  build: {
    "index.html": "index.html",
    "views/HomeView.html": [
      "views/HomeView.html"
    ],
    "views/ClientView.html": [
      "views/ClientView.html"
    ],
    "views/VendorView.html": [
      "views/VendorView.html"
    ],
    "views/ManagementView.html": [
      "views/ManagementView.html"
    ],
    "views/ClientDashView.html": [
      "views/ClientDashView.html"
    ],
    "views/CreateContractView.html": [
      "views/CreateContractView.html"
    ],
    "views/DevelopmentView.html": [
      "views/DevelopmentView.html"
    ],
    "app.js": [
      "javascripts/app.js"
    ],
    "controller.js":[
      "javascripts/controller.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  deploy: [
    "MetaCoin",
    "ConvertLib",
    "EthPMA"
  ],
  rpc: {
    host: "localhost",
    port: 8545
  }
};
