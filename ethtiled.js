//	ETHTiled :: 
//	With this NodeJS script you can convert your TILED maps (.json)
//  into ETHTiled - Entity Map format (.emx) 
//-----------------------------------
//	Elliot Max. Lorenzo Megias
//	github.com/unknown0perator/ETHTiled

//--- LOAD .json 
const args = process.argv;	const targetFile = args[2];
if (targetFile != undefined){
	var target = '';	var spl1t = targetFile.split('.');
	if(spl1t[1] == 'json'){ 
		//----- Notify : target output will overwrite previous output
		require('fs').unlink(spl1t[0]+'.emx', function (err) {
			if(err == null){
				console.log('  >>>>>   [WARNING!] :: This will overwrite :: '+spl1t[0]+'.emx   <<<<<');
				try { parseTarget(JSON.parse(require('fs').readFileSync(args[2], 'utf8'))); }
				catch(e) {console.log(e + "\n"); }
			}else{
				try { parseTarget(JSON.parse(require('fs').readFileSync(args[2], 'utf8'))); }
				catch(e) {console.log(e + "\n"); }
			}
		});
		//-----
	}else{ displayMsg(); }
}else{ displayMsg(); }
//--- 
function displayMsg(){
	console.log("   ╔═════════════════════════════════╗  ");
	console.log("   ║       ~ ETHANON  ENGINE ~       ║  ")
	console.log("   ╚═════════════════════════════════╝  ");
	console.log("     EᴛʜTɪʟᴇᴅ :: ᴊꜱᴏɴ > ᴇᴍx ᴄᴏɴᴠᴇʀᴛᴇʀ   ");
	console.log(" ╔───╦═════════════════════════════════╗");
	console.log(" │ > ║   Elliot Max. Lorenzo Megias    ║");
	console.log(" ╠───╝   github.com/unknown0perator/   ║");
	console.log(" ╚═════════════════════════════════════╝");
	console.log(" ╔───╦═════════════════════════════════╗");
	console.log(" │ ? ║  Convert Tiled JSON to EMX :    ║");
	console.log(" ╠───╝  # node ethtiled.js target.json ║");
	console.log(" ╚═════════════════════════════════════╝");
}
//-------------------------------------------------------------------
function parseTarget(js0n){
	var _tiles = [];  var _entities = [];
	// ORIENTATION CHECK : 'orthogonal' is currently the only supported orientation type
	if(js0n.orientation != 'orthogonal'){ console.log('Error : json.orientation must be orthogonal.'); process.exit(); }
	//
console.log("   ╔═════════╗ ");
console.log("   ║ ┌─┬─┬─┐ ║  ~ TILED : MAP EDITOR ");
console.log("   ║ └─┼─┼─┘ ║     ᴛᴀʀɢᴇᴛ .ᴊꜱᴏɴ :: "+targetFile);   
console.log("   ║   ├─┤   ║     ᴛᴏᴛᴀʟ ʟᴀʏᴇʀs = "+js0n.layers.length);                
console.log("   ║   └─┘   ║     ᴛᴏᴛᴀʟ ᴛɪʟᴇsᴇᴛs = "+js0n.tilesets.length);
console.log("   ╚═════════╝ ");
	//
	for(var li=0; li<js0n.layers.length; li++){ // For each layer stored in the target json 
		// # 1 : GENERATE LIST OF UNIQUE TILE_ID (used in this layer)
		for(var di=0; di<js0n.layers[li].data.length; di++){ // For each tile @ this layer
			//console.log(js0n.layers[li].data[di]);
			if(js0n.layers[li].data[di] != 0){
				var tileIndex = _tiles.indexOf(js0n.layers[li].data[di]);
				if(tileIndex == -1){ // This tile_id is not in the storage
					_tiles.push(js0n.layers[li].data[di]);	//So store the tile_id in the tile_type list
				}
			}
		}
		//  # 2 : GENERATE LIST OF TILE_ID + ENTITY PROPS
		for(var i=0; i<_tiles.length; i++){ // For each tile @ unique tile_id list
			var current_tileID = js0n.tilesets[li].tileproperties[_tiles[i]-1];
			// CHECK : f (FRAME PROP : x,y)
			if(current_tileID.f != undefined){
				var spirteXY = (current_tileID.f).split(',');
				var spriteX = spirteXY[0];
				var spriteY = spirteXY[1];
				//var spriteW = js0n.tilesets[li].tilewidth;
				//var spriteH = js0n.tilesets[li].tileheight;
			}else{	// ERROR : Detected a used tile_id with no name prop
				console.log("      ╔───╦═══════════╗");
				console.log("      │ ! ║   ERROR   ║");
				console.log("      ╚───╩═══════════╝");
				console.log(" [!] @ (tile:"+(_tiles[i]-1)+") :: tile doesn't contain 'f' (frame) prop \n    Please, read the manual for a correct usage.");
				process.exit();
			}
			// CHECK : n (NAME PROP : name.ent)
			var tilesetName = (js0n.tilesets[li].name);
			var xpl1t = tilesetName.split('.');
			if(xpl1t[1] == 'ent'){ // The whole tileset = unique entity
				var this_tileEnt = '['+_tiles[i]+'|'+js0n.tilesets[li].name+'|'+spriteX+'|'+spriteY;//+'|'+spriteW+'|'+spriteH;
				//console.log("                   "+this_tileEnt);
				_entities.push(this_tileEnt);
			}else{ // The tileset has no name set, so each tile might be a different entity
				//console.log("  tileset["+li+"] :: name doesn't contain .ent extension");
				//console.log("          ~ checking each tile for 'n' (name) prop :");
				if(current_tileID.n != undefined){
					var ctname = current_tileID.n;
					var xspl1t = ctname.split('.');
					if(xspl1t[1] == 'ent'){ 
						var this_tileEnt = '['+_tiles[i]+'|'+current_tileID.n+'|'+spriteX+'|'+spriteY;//+'|'+spriteW+'|'+spriteH;
						//console.log("          ~ found :\n                   "+this_tileEnt);
					}else{ // ERROR : Detected a used tile_id with incorrect name prop format
						console.log("      ╔───╦═══════════╗");
						console.log("      │ ! ║   ERROR   ║");
						console.log("      ╚───╩═══════════╝");
						console.log(" [!] @ (tile:"+(_tiles[i]-1)+") :: tile 'n' (name) prop missing .ent extension \n    Please, read the manual for a correct usage.");
						process.exit();
					}
				}else{ // ERROR : Detected a used tile_id with no name prop
					console.log("      ╔───╦═══════════╗");
					console.log("      │ ! ║   ERROR   ║");
					console.log("      ╚───╩═══════════╝");
					console.log(" [!] @ (tile:"+(_tiles[i]-1)+") :: tile doesn't contain 'n' (name) prop \n    Please, read the manual for a correct usage.");
					process.exit();
				}
			}
		}
		//  # 3 : OBTAIN JSON PROPS :
		var _header = js0n.width +'|'+ js0n.height +'|' + js0n.tilewidth +'|'+ js0n.tileheight + '$';
 		createEntLayer(_header, _entities, js0n.layers[li].data);
 		_entities = []; _tiles = []; //re-init entities & tiles
	}
		//console.log(_tiles);
		//console.log(_entities);
	// DISPLAY PARSED DETAILS
	console.log("      ╔───╦════════════════════════╗");
	console.log("      │ + ║ SUCCESSFULLY CONVERTED ║");
	console.log("      ╚───╩════════════════════════╝");
console.log("   ╔═╤══╤══╤═╗ ");
console.log("   ║┈┼┈┈┼┈┈┼┈║  ~ ETHANON ENGINE ");
console.log("   ║┈┼┈emx┈┼┈║     ᴇɴᴛɪᴛʏ ᴍᴀᴘ :: "+spl1t[0]+".emx");
console.log("   ║┈┼┈┈┼┈┈┼┈║  ꜱᴛᴏʀᴇ .ᴇᴍx ᴏᴜᴛᴘᴜᴛ @ ᴘʀᴏʏᴇᴄᴛ'ꜱ /tiled ᴅɪʀᴇᴄᴛᴏʀʏ");
console.log("   ║┈┼┈┈┼┈┈┼┈║    &  ɪᴍᴘᴏʀᴛ ɪɴᴛᴏ ꜱᴄᴇɴᴇ ᴡɪᴛʜ EᴛʜTɪʟᴇᴅ ʟɪʙ.");
console.log("   ╚═╧══╧══╧═╝ ");
}
//-------------------------------------------------------------------
function createEntLayer(header, entities, map){
	var entLayer = '%'+header;
	for(var i=0; i<entities.length; i++){entLayer = entLayer + entities[i];}
	entLayer = entLayer + '$' + map.toString();
	//console.log(entLayer);
	require('fs').appendFile(spl1t[0]+'.emx', entLayer, function (err) {});

}