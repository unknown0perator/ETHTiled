// ETHANON ENGINE 
// ETHTiled :: TILED MAP SUPPORT LIBtele
// Requires a previous conversion of the exported .json to .emx
//
// [ LOAD EMX FILE ] -------------------------------------------------------------------------------------------
	void EMX(string target__){
		// PATH TO MAP FILE 
		const string resourceDir = GetResourceDirectory();
		string targetEMX = target__;
		const string EMX_MapFile = GetStringFromFile(resourceDir + targetEMX); //"tiled/example.emx"
		print(' [+] ETHTiled :: loading '+targetEMX);
		// DETECT LAYERS :
		string[] emx_layers = splitString( EMX_MapFile , "%" );
		for(int i=1; i<emx_layers.length; i++){ // FOR EACH LAYER
			string this_layerS = emx_layers[i];
			string[] this_layer = splitString( this_layerS , "$" );
			//--- LAYER PROPS 
			string[] this_layerProps = splitString( this_layer[0] , "|" );
			int layer_cols = parseInt(this_layerProps[0]);	
			int layer_rows = parseInt(this_layerProps[1]);
			int layer_tileW = parseInt(this_layerProps[2]);	
			int layer_tileH = parseInt(this_layerProps[3]);
			print(' [i] ETHTiled :: layer['+i+'] : '+layer_cols+'x'+layer_rows+'('+layer_tileW +'x'+ layer_tileH+')');
			//--- LAYER ENTITIES
			string[] this_layerEnts = splitString( this_layer[1] , "[" );
			for(int e=1; e<this_layerEnts.length; e++){ //FOR EACH ENTITY TILE_ID USED IN THIS LAYER
				string this_ent = this_layerEnts[e];
				string[] _ent = splitString( this_ent , "|" );
				//-- Current Entity --------------------------------------------------\\
				int ent_id =  parseInt(_ent[0]);	
				string ent_name = _ent[1];				
				int ent_frameX =  parseInt(_ent[2]);
				int ent_frameY =  parseInt(_ent[3]);
				print(' [i] ETHTiled :: '+ent_id + ' ' + ent_name + ' ' + ent_frameX + ',' + ent_frameY);
				//--- CHECK LAYER CSV MAP FOR THIS ENTITY TILE_ID
				string[] this_layerMap = splitString( this_layer[2] , "," );
				int layerMap_index = 0;
				for(int y=0; y<layer_rows; y++){ //FOR EACH LAYER ROW
					for(int x=0; x<layer_cols; x++){ //CHECK EACH COLUMN
						int curTile_id = parseInt(this_layerMap[layerMap_index]);
						if(curTile_id == ent_id){
							ETHEntity @current_tile;	
							float cmx = x*layer_tileW;
							float cmy = y*layer_tileH;
							AddEntity(ent_name, vector3(cmx, cmy, 0.0f), current_tile);
							current_tile.SetFrame(ent_frameX,ent_frameY);
						}
						layerMap_index++;
					}
				}
			}
		}
		print(' [+] ETHTiled :: imported '+targetEMX);

	}
// -------------------------------------------------------------------------------------------------------------