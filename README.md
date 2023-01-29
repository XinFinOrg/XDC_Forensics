
# Forensics-ui

<p align="center">
  <img src="./src/assets/img/XDC-Forensics.png" />
</p>

<p align="center">
  XDC forking detection system <br/>
  with a mission to be the most reliable blockchain
</p>
<br/>

## Dev setup
UI of XDC Forensics monitoring

```
nvm use
npm run install:clean
npm run dev
```

Go to http://localhost:8080

## Host on server
Note: Below will run the frontend only. In order to have the forensics fully funcational, you are required to host the backend as well.
Please follow the instruction from [XDC-Stats](https://github.com/XinFinOrg/XDCStats) to host the forensics backend.

1. Install serve
```
npm install -g serve
```

2. Start the server
```
npm run start
```
It shall now runs on port 8888
