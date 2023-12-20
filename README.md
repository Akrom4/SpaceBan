# <p align="center">Spaceban</p>
   ![screenShot](https://github.com/Akrom4/SokoPac/assets/75309565/14f87e25-2031-44c9-aa8f-c91526f45a1a) 
<p>SpaceBan is a twist on the classic Sokoban puzzle game. As Rob the Robot, your mission is to move Aliens onto the lights. Be careful not to trap yourself!</p>


## ⌨️ Controls
Arrow Keys : Move Rob <br/>
U : Undo the last move <br/>
R : Restart the current level<br/>

## 🛠️ Tech Stack
<ul>
    <li>HTML
    <li>CSS
    <li>JavaScript
    <li>Python
</ul>

## 🧐 Development
        
SpaceBan follows the MVVM (Model-View-ViewModel) design pattern for structured and maintainable code.<br/> 

<p>Here's the project structure :</p>
│<b>Spaceban</b><br/>
│   index.html<br/>
├───Images<br/>
├───Maps<br/>
│       AutoGen.json<br/>
│       Handmade.json<br/>
│       Vanilla.json<br/>
├───Models<br/>
│       MapCollection.js<br/>
│       SokoPacModel.js<br/>
│       SokoPacView.js<br/>
│       SokoPacViewModel.js<br/>
├───Styles<br/>
└───Utils<br/>
    │   downloadMaps.py<br/>
    │   parseDownloadedMap.py<br/>
    │   parseMap.py<br/>
    │   parseYohsioMusareMap.py<br/>
    └───SokobanMaps<br/>
        ├───AutoGen<br/>
        ├───Handmade<br/>
        └───Original<br/>

### Components
<b>Maps</b> : Contains JSON files with map layouts, categorized into collections.<br/>
<b>Models</b> : Houses MVVM classes and MapCollection for parsing map data.<br/>
<b>Styles</b> : CSS files for styling.<br/>
<b>Utils</b> : Python utilities for downloading and parsing maps from <a href="https://www.ne.jp/asahi/ai/yoshio/sokoban/index.html">Yoshio Murase's Sokoban website</a>.<br/>
