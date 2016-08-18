module.exports = {
  build: {
    "index.html": "index.html",
    "views/HomeView.html": [
      "views/HomeView.html"
    ],
    "views/ClientView.html": [
      "views/ClientView.html"
    ],
    "views/ClientDashView.html": [
      "views/ClientDashView.html"
    ],
    "views/CreateContractView.html": [
      "views/CreateContractView.html"
    ],
    "views/VendorView.html": [
      "views/VendorView.html"
    ],
    "views/VendorDashView.html": [
      "views/VendorDashView.html"
    ],
    "views/ManagementView.html": [
      "views/ManagementView.html"
    ],
    "views/ManagementActiveView.html": [
      "views/ManagementActiveView.html"
    ],
    "views/ManagementPendingView.html": [
      "views/ManagementPendingView.html"
    ],
    "views/DevelopmentView.html": [
      "views/DevelopmentView.html"
    ],
    "views/DeveloperActiveView.html": [
      "views/DeveloperActiveView.html"
    ],
    "views/DeveloperPendingView.html": [
      "views/DeveloperPendingView.html"
    ],
    "app.js": [
      "javascripts/app.js"
    ],
    "controller.js":[
      "javascripts/controller.js"
    ],
    "ng-scrollbar.js":[
      "javascripts/ng-scrollbar.js"
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
