export TERM=xterm-256color
reset
cd ~/Projects/node/lnug-streams/presentation
mdp ./presentation.md
clear
imgcat ../node-conf-white.png
echo "\n\nHere’s a discount for 15% on regular conference or conference + workshop\n https://ti.to/barcelonajs/nodeconf-barcelona-2015/discount/LNUG"
read
clear
nd node-conf-perf-workshop.md
read
clear
imgcat ../node-conf-white.png
echo "\n\nHere’s a discount for 15% on regular conference or conference + workshop\n https://ti.to/barcelonajs/nodeconf-barcelona-2015/discount/LNUG"
read
mdp end.md
