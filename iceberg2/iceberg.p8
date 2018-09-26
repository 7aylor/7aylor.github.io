pico-8 cartridge // http://www.pico-8.com
version 16
__lua__
--iceberg2
--by taylor buchheit
function _init()
 cls()
 poke(0x5f2c,3)
 
 --global vars
 frame=0
 max_size=64
 level=1
 iceberg_health=10
 iceberg_min=max_size
 iceberg_max=max_size
 world_frame=11
 fire=96
 starty=0
 flag_sprite=82
 cloudy=0
 don_in=false
 don_off=0
 don_size=0
 penguin_wait=150
 tut=1
 laugh=false
 enemy_talk=false
 never_melt=true
 
 start=true
 tutorial=false
 lose=false
 win=false
 msc=false
 
 credits=0
 level_credits=0
 heals=0
 
 win_creds=2500
 win_heals=50
 
 --objects
 waves={}
 iceberg={}
 damaged={}
 p={x=32,y=32,xoff=2,yoff=1,
 								h=6,w=4,sprite=48,
 								flp=false,d="d",
 								moving=false,
 								speed=1,
 								pngn=false}
 enemy={x=24,y=24,sprite=64,
 							flp=false,d="d",speed=0.5}
 pngn={x=-1,y=-1,sprite=18,
 									draw=false,
 									count=0,
 									wait=0,
 									hit=false}
 items={}
 
 clouds={}
 init_clouds()
 								
 build_level()
end

function _update()
 frame+=1
 if(start==false and 
 			tutorial==false) then
  if(lose==false and
  			win==false) then
  --gameplay
   check_next_level()
   update_waves_sprites()
   spawn_items()
   move_enemy()
   hit_enemy()
   move_player()
   enemy_pickup_item()
   walk_on_obs()
   spawn_penguin()
   pickup_item()
   damage_iceberg()
   update_penguin()
   check_win()
  --end menu
  elseif(lose==true) then
   move_world()
   update_fire()
   if(msc==false) then
    music(1)
    msc=true
   end
   if(btnp(5)) then
    music(-1)
    _init()
   end
  elseif(win==true) then
   --play sound
   move_world()
   if(msc==false) then
    music(0)
    msc=true
   end
   
   if(btnp(5)) then
    music(-1)
    _init()
   end
  end
 elseif(tutorial==true) then
  if(tut==1) then
   if(btnp(5)==true) then
    tut=2
   end
  elseif(tut==2) then
   if(btnp(5)==true) then
    tutorial=false
   	tut=0
   end
  end
 else
 --start menu
  update_start()
  update_flag()
  move_cloud()
  if(btnp(5)==true and 
  		don_in==false) then
   --start=false
   don_in=true
  end
 end
end

function _draw()
 if(start==false) then
  if(tutorial==true) then
   if(tut==1) then
    draw_tutorial1()
   elseif(tut==2) then
    draw_tutorial2()
   end
  elseif(lose==false and 
         win==false) then
   rectfill(0,0,63,63,12)
   draw_waves()
   draw_iceberg()
   
   print("$"..credits,1,1,cred_col)
   
   --heals
   spr(35,56,0)
   if(heals<10) then
    print(heals,52,1,8)
   elseif(heals>=10) then
    print(heals,48,1,8)
   end
   
   --iceberg health
   spr(37,24,0)
   print(iceberg_health,33,1,1)
   
  --enemy speed
   --print(enemy.speed,1,56)
   
   draw_items()
   draw_player()
   draw_enemy()
   draw_penguin()
   if(credits==0) then
    cred_col=9
   elseif(credits<0) then
    cred_col=8
   else
    cred_col=11
   end

  elseif(win==true) then
   cls()
   rectfill(0,0,63,63,11)
   draw_world()
   print("you have saved",6,1,7)
   print("the iceberg from",1,9)
   print("bad don!",16,17,2)
   print("climate change",6,34,7)
   print("is real and we",6,42)
   print("can fix it!",12,50)
   print("❎ main menu",10,58,0)
  else
  --lose
   cls()
   rectfill(0,0,63,63,8)
   draw_world()
   draw_fire()
   print("we're doomed!",8,8,0)
   print("❎ main menu",10,52,0)
  end
 else
 --start screen
 	if(start==true) then
   rectfill(0,0,63,31,13)
   rectfill(0,32,63,63,12)
 
   draw_clouds()
   draw_don_berg()
   draw_iceberg_waves()
   
   print("iceberg 2",14,2,1)
   print("wrath of don",11,51,2)
   blink_start()
   fade_in_don()
  end
 end
end
-->8
--init functions

--[[
builds the iceberg and 
waves for the levels]]
function build_level()
 --clear tables
 clear_table(waves)
 clear_table(iceberg)
 clear_table(items)
 clear_table(damaged)
 
 p.x=32
 p.y=32
 enemy.x=24
 enemy.y=24
 level_credits=0
 init_enemy_speed()
 
 if(level==1) then
  iceberg_health=10
  iceberg_min=8
  iceberg_max=56
  add_waves(0,max_size-8)
  build_iceberg(8,max_size-16)
 elseif(level==2) then
  iceberg_health=7
  iceberg_min=16
  iceberg_max=48
  add_waves(8,max_size-16)
  build_iceberg(16,max_size-24)
 elseif(level==3) then
  iceberg_heatlh=5
  iceberg_min=24
  iceberg_max=40
  add_waves(16,max_size-24)
  build_iceberg(24,max_size-32)
 end
end

function init_enemy_speed()
 if(level==1) then
  enemy.speed=0.25
 elseif(level==2) then
  enemy.speed=0.2
 elseif(level==3) then
  enemy.speed=0.15
 end
end

--adds waves to the waves table
function add_waves(min_val,max_val)
 for i=min_val,max_val,8 do
 	--left corner
 	if(i==min_val) then
 		--top left
 	 add(waves,{x=min_val,y=min_val,
 	 				sprite=5,flipx=true,
 	 				flipy=true})
 	 --bottom left
 	 add(waves,{x=min_val,y=max_val,
   				sprite=5,flipx=true,
   				flipy=false})
  --right corner
 	elseif(i==max_val) then
 	 --top right
   add(waves,{x=max_val,y=min_val,
   				sprite=5,flipx=false,
   				flipy=true})
   --bottom right
   add(waves,{x=max_val,y=max_val,
   				sprite=5,flipx=false,
   				flipy=false})
 	else
  	--left
   add(waves,{x=min_val,y=i,
   				sprite=1,flipx=false,
   				flipy=false})
   --right
   add(waves,{x=max_val,y=i,
   				sprite=1,flipx=true,
   				flipy=false})
   --top
   add(waves,{x=i,y=min_val,
   				sprite=3,flipx=false,
   				flipy=true})
   --bottom
   add(waves,{x=i,y=max_val,
   				sprite=3,flipx=true,
   				flipy=false})	
  end
 end
end

function build_iceberg(min_val,max_val)
 for i=min_val,max_val,8 do
  for j=min_val,max_val,8 do
   --top left
   if(i==min_val and 
   			j==min_val) then
   	add(iceberg,{x=i,y=j,
   					sprite=7,flipx=false,
   					flipy=false,health=3})
			--bottom left
   elseif(i==min_val and 
   							j==max_val) then
   	add(iceberg,{x=i,y=j,
   					sprite=7,flipx=false,
   					flipy=true,health=3})
   --top right
   elseif(i==max_val and
   							j==min_val) then
   	add(iceberg,{x=i,y=j,
   					sprite=7,flipx=true,
   					flipy=false,health=3})
   --bottom right
   elseif(i==max_val and
   							j==max_val) then
   	add(iceberg,{x=i,y=j,
   					sprite=7,flipx=true,
   					flipy=true,health=3})
   --middle
   else
   --top side
    if(j==min_val) then
     add(iceberg,{x=i,y=j,
    					sprite=9,flipx=false,
    					flipy=false,health=3})
    --bottom side
    elseif(j==max_val) then
     add(iceberg,{x=i,y=j,
    					sprite=9,flipx=true,
    					flipy=true,health=3})    
    --left side
    elseif(i==min_val) then
     add(iceberg,{x=i,y=j,
    					sprite=10,flipx=false,
    					flipy=false,health=3})     
    --right side
    elseif(i==max_val) then
     add(iceberg,{x=i,y=j,
    					sprite=10,flipx=true,
    					flipy=false,health=3})
   	else
 				add(iceberg,{x=i,y=j,
    					sprite=8,flipx=false,
    					flipy=false,health=3})
    end
   end
  end
 end
end

function clear_table(t)
	for item in all(t) do
	 del(t,item)
	end
end

function reset_penguin()
 pngn.x=-1
 pngn.y=-1
 pngn.sprite=18
 pngn.draw=false
 pngn.count=0
 pngn.wait=0
 pngn.hit=false
 init_enemy_speed()
end

function init_clouds()
 --[[add(clouds,{x=2,y=14,r=5,c=13})
 add(clouds,{x=12,y=14,r=5,c=13})
 add(clouds,{x=20,y=13,r=4,c=13})
 add(clouds,{x=28,y=14,r=6,c=13})
 add(clouds,{x=36,y=14,r=4,c=13})
 add(clouds,{x=44,y=14,r=5,c=13})
 add(clouds,{x=52,y=14,r=6,c=13})
 add(clouds,{x=60,y=14,r=4,c=13})
 ]]
 
 add(clouds,{x=0,y=13,r=3})
	add(clouds,{x=8,y=14,r=4})
 add(clouds,{x=16,y=15,r=3})
 add(clouds,{x=22,y=14,r=3})
 add(clouds,{x=28,y=12,r=3})
 add(clouds,{x=34,y=14,r=4})
 add(clouds,{x=42,y=15,r=3})
 add(clouds,{x=48,y=13,r=4})
 add(clouds,{x=54,y=12,r=3})
 add(clouds,{x=61,y=14,r=4})
end
-->8
--update functions
function update_waves_sprites()
 if(frame%15==0) then
  for i=1,#waves do
			if(waves[i].sprite%2==0) then
			 waves[i].sprite-=1
			else
			 waves[i].sprite+=1			
			end
  end
 end
end

function move_player()
  p.moving=true
  --left
  if(btn(0)==true and
     p.x+2>iceberg_min) then
   p.x-=p.speed
   p.flp=true
   p.d="l"
  --right
  elseif(btn(1)==true and
  		p.x+6<iceberg_max) then
   p.x+=p.speed
   p.flp=false
   p.d="r" 
  --up 
  elseif(btn(2)==true and
  		p.y+5>iceberg_min) then
   p.y-=p.speed
   p.d="u"
  --down
  elseif(btn(3)==true and
   p.y+8<iceberg_max) then
   p.y+=p.speed
   p.d="d"
  else
  	p.moving=false
  end
  
  if(p.moving==true) then
   if(frame%6==0) then
    sfx(7)
   end
  end
end

function move_enemy()

 if(enemy.speed>0) then
  local distx=abs(p.x-enemy.x)
  local disty=abs(p.y-enemy.y)
  
  if(distx>disty) then
   if(p.x>enemy.x) then
    enemy.x+=enemy.speed
    enemy.d="r"
    enemy.flp=false
   else
    enemy.x-=enemy.speed
    enemy.d="l"
    enemy.flp=true
   end
  else
   if(p.y>enemy.y) then
    enemy.y+=enemy.speed
    enemy.d="u"
   else
    enemy.y-=enemy.speed
    enemy.d="d"
   end
  end
 end
end

function hit_enemy()
	--penguin
	if(enemy.x+1>
   			pngn.x+6==false and
   			enemy.x+6<
   			pngn.x+1==false and
						enemy.y+2>
						pngn.y+6==false and
						enemy.y+6<
						pngn.y+1==false) then
		enemy.speed=0
		if(pngn.hit==false) then
		 sfx(5)
		 pngn.hit=true
		end
	end

 --player
 if(enemy.speed>0 and 
 		(enemy.x+3>
   	p.x+p.xoff+p.w==false and
   	enemy.x+4<
   	p.x+p.xoff==false and
				enemy.y+2>
				p.y+p.yoff+p.h==false and
				enemy.y+6<
				p.y+p.yoff==false)) then
		lose=true
	end
end

function enemy_pickup_item()
 if(items!=nil and #items>0) then
  for i=1,#items do
  	--finish hit detection with offsets
   if(items[i].x+2>
   			enemy.x+6==false and
   			items[i].x+6<
   			enemy.x+2==false and
						items[i].y+2>
						enemy.y+7==false and
						items[i].y+6<
						enemy.y+2==false) then
   	del(items, items[i])
   	credits-=50
   	sfx(0)
   	break
   end
  end
 end
end

function damage_iceberg()
 if(rnd(1)<0.01) then
  iceberg_health-=1
  damage_iceberg_tile()
  sfx(1)
 end
end

function damage_iceberg_tile()
 repeat
  tile=flr(rnd(#iceberg))+1
 until iceberg[tile].health>1
 
 iceberg[tile].health-=1
 iceberg[tile].sprite+=16
 add(damaged,tile)
end

function spawn_items()
 if(rnd(1)<0.00125*(10-level)) then
  local s=32+flr(rnd(2))
  local xx=-1
  local yy=-1
  
  while(xx==-1 or yy==-1 or
  						contains(items,xx,yy)) do
  	xx=get_rand_pos()
  	yy=get_rand_pos()
  end
  sfx(8)
  add(items,{x=xx,y=yy,sprite=s})
 end
end

function contains(list,xx,yy)
 if(list!=nil and #list>0) then
	 for i=1,#list do
	  if(list[i].x==xx and list[i].y==yy) then
				return true
	  end
	 end
	else
	 return false
	end
end

function get_rand_pos()
 return (flr(rnd(
 							(iceberg_max-iceberg_min)
 							/8))*8)+(iceberg_min)
end

function check_next_level()
 if(iceberg_health<=0 and
 			level<3) then
  level+=1
  never_melt=false
  build_level()
 elseif(level_credits>6-level) then
  if(level==2 and
  			iceberg_health==10) then
   level=1
   build_level()
  elseif(level==3 and
  							iceberg_health==5) then
   level=2
   build_level()
  end
 end
end

function spawn_penguin()
 if(btnp(5)==true and
    pngn.wait>penguin_wait) then
  pngn.draw=true
  pngn.x=p.x
  pngn.y=p.y
  p.pngn=false
  p.pngn=false
  
  if(p.d=="d") then
   pngn.y+=8
  elseif(p.d=="u") then
   pngn.y-=8
  elseif(p.d=="l") then
   pngn.x-=8
  else
   pngn.x+=8
  end
 end
end

function pickup_item()
 if(items!=nil and #items>0) then
  for i=1,#items do
  	--finish hit detection with offsets
   if(items[i].x+3>
   			p.x+p.xoff+p.w==false and
   			items[i].x+5<
   			p.x+p.xoff==false and
						items[i].y+3>
						p.y+p.yoff+p.h==false and
						items[i].y+5<
						p.y+p.yoff==false) then
   	del(items, items[i])
   	heal_iceberg()
   	credits+=50
   	level_credits+=1
   	heals+=1
   	if(enemy.speed<2) then
   	 enemy.speed+=0.05
   	end
   	sfx(2)
   	break
   end
  end
 end
end

function heal_iceberg()
	if(damaged!=nil and #damaged>0) then
 	local d=damaged[#damaged]
 	iceberg[d].health+=1
 	iceberg[d].sprite-=16
 	del(damaged,d)
 	iceberg_health+=1
	end
end

function walk_on_obs()
 if(damaged!=nil and 
    #damaged>0) then
  for i=1,#damaged do
  	--finish hit detection with offsets
  	local ind=damaged[i]
  	if(iceberg[ind].sprite==24) then
    if(iceberg[ind].x+3>
    			p.x+p.xoff+p.w==false and
    			iceberg[ind].x+5<
    			p.x+p.xoff==false and
 						iceberg[ind].y+2>
 						p.y+p.yoff+p.h==false and
 						iceberg[ind].y+5<
 						p.y+p.yoff==false) then
    	p.speed=0.25
    	return
    end
   end
   if(iceberg[ind].sprite==40) then
    if(iceberg[ind].x+1>
    			p.x+p.xoff+p.w==false and
    			iceberg[ind].x+6<
    			p.x+p.xoff==false and
 						iceberg[ind].y+1>
 						p.y+p.yoff+p.h==false and
 						iceberg[ind].y+6<
 						p.y+p.yoff==false) then
    	p.speed=0.25
    	return
    end
   end
  end
 end
 p.speed=1
end

function move_world()
 if(frame%15==0) then
  if(world_frame==11) then
   world_frame=13
  elseif(world_frame==13) then
   world_frame=43  
  elseif(world_frame==43) then
   world_frame=45
  elseif(world_frame==45) then
   world_frame=11
  end
 end
end

function update_fire()
 if(frame%5==0) then
  if(fire==98) then
   fire=96
  else
   fire+=1
  end
 end
end

function update_penguin()
 if(pngn.draw==true) then
  pngn.wait=0
  pngn.count+=1
  
  if(pngn.count>=60) then
   reset_penguin()
   return
  end
 
  if(frame%20==0) then
   if(pngn.sprite==18) then
    pngn.sprite=19
    sfx(4)
   else
    pngn.sprite=18
   end
  end
 else
  pngn.wait+=1
 end
end

function update_start()
 if(frame%30==0) then
  starty=1-(starty%2)
 end
end

function update_flag()
 if(frame%5==0) then
  if(flag_sprite==86) then
   flag_sprite=82
  else
   flag_sprite+=1
  end
 end
end

function move_cloud()
 for i in all(clouds) do
	 if(rnd(1)<0.01) then
	  i.x+=1-flr(rnd(3))
	  i.y+=1-flr(rnd(3))
	  --i.r+=1-flr(rnd(3))
  end
 end 
end

function check_win()
 if(credits>=win_creds or
 			heals>=win_heals) then
  win=true
 elseif(heals>=(win_heals/2) and
 							never_melt==true) then
  win=true							
 end
end
-->8
--draw functions
function draw_waves()
 for i=1,#waves do
  spr(waves[i].sprite,
  				waves[i].x,waves[i].y,
  				1,1,waves[i].flipx,
  				waves[i].flipy)
 end
end

function draw_iceberg()
 for i=1,#iceberg do
  spr(iceberg[i].sprite,
  				iceberg[i].x,iceberg[i].y,
  				1,1,iceberg[i].flipx,
  				iceberg[i].flipy)
 end
end

function draw_player()
 if(p.moving==false) then
  if(p.d=="l") then
   p.sprite=54
  elseif(p.d=="r") then
   p.sprite=54
  elseif(p.d=="u") then
   p.sprite=51
  elseif(p.d=="d") then
   p.sprite=48
  end
 else
  if(frame%3==0) then
   if(p.d=="l" or
      p.d=="r") then
    if(p.sprite==54) then
     p.sprite=55
    else
     p.sprite=54
    end
   elseif(p.d=="u") then
    if(p.sprite==51 or
    			p.sprite==53) then
    	p.sprite=52
    else
     p.sprite=53
    end
   elseif(p.d=="d") then
    if(p.sprite==48 or
    			p.sprite==50) then
    	p.sprite=49
    else
     p.sprite=50
    end
   end
  end
 end

 spr(p.sprite,p.x,p.y,1,1,p.flp)
 if(pngn.wait>penguin_wait) then
  line(p.x+3,p.y,p.x+4,p.y,11)
  if(p.pngn==false) then
   sfx(6)
   p.pngn=true
  end
 end
end

function draw_enemy()
 if(enemy.speed>0) then
 	if(frame%5==0) then
   if(enemy.d=="l" or
      enemy.d=="r") then
    if(enemy.sprite==70) then
     enemy.sprite=71
    else
     enemy.sprite=70
    end
   elseif(enemy.d=="u") then
    if(enemy.sprite==65) then
    	enemy.sprite=66
    else
     enemy.sprite=65
    end
   elseif(enemy.d=="d") then
    if(enemy.sprite==68) then
    	enemy.sprite=69
    else
     enemy.sprite=68
    end
   end
  end
 end
 
 spr(enemy.sprite,
 				enemy.x,enemy.y,
 				1,1,enemy.flp)
end

function draw_items()
 if(#items>0) then
  for i=1,#items do
   spr(items[i].sprite,
   				items[i].x,
   				items[i].y)
  end
 end
end

function draw_world()
 spr(world_frame,24,20,2,2)
end

function draw_fire()
 spr(fire,8,29-4)
 spr(fire,48,35-4)
 spr(fire,33,20-2)
 spr(fire,24,31-4)
 spr(fire,22,20-4)
 spr(fire,32,32-4)
 spr(fire,23,40-4)
 spr(fire,37,43-4)
 spr(fire,12,36-4)
end

function draw_penguin()
 if(pngn.draw==true) then
  spr(pngn.sprite,pngn.x,pngn.y)
 end
end

function draw_don_berg()
 spr(75,16,16+starty,4,4)
 spr(flag_sprite,21,12+starty)
 spr(80+starty,26,11+starty)
end

function draw_clouds()
 for i in all(clouds)do
  circfill(i.x+1,i.y+1,i.r+1,5)
  circfill(i.x,i.y,i.r,6)
 end
end

function draw_iceberg_waves()
 if(starty==1) then   
 
  --left
  line(13,37,15,35,7)
  line(13,41,16,43,7)
  line(19,44,26,45,7)
  
  --right
  line(34,45,44,43,7)
  line(47,42,50,40,7)
  line(49,35,50,36,7)
 end
end

function blink_start()
 if(don_in==false) then
  if(frame%30<16) then
   print("❎ to start",13,58,7)
  end
 else
  if(frame%10<5) then
   print("❎ to start",13,58,1)
  else
   print("❎ to start",13,58,8)
  end
 end
end

function fade_in_don()
	if(don_in==true) then
  if(don_size<=150) then
   if(frame%5==0) then	
    don_off=8-don_off
   end
   
   if(laugh==false) then
    sfx(3,2)
    laugh=true
   end
   sspr(72+don_off,24,8,8,
   					28-don_size/2,28-don_size/2,
   					8+don_size,8+don_size)
   don_size+=2
  else
   start=false
   tutorial=true
   sfx(-1,2)
   cls()
  end
 end
end

function draw_tutorial1()
 rectfill(0,0,63,63,13)
 print("how to play", 12,2,7)
 spr(enemy.sprite,2,10)
 print("avoid bad don",11,12,2)
 spr(32,1,21)
 spr(33,3,20)
 print("heals iceberg",11,21,7)
 spr(56,1,29)
 print("avoid slow",11,30)
 spr(pngn.sprite,1,38)
 print("❎ stun don",11,39)
 print("⬆️⬇️⬅️➡️",2,49,7)
 print("-move",34,49,1)
 print("❎➡️",48,58,7)
end

function draw_tutorial2()
 rectfill(0,0,63,63,13)
 print("how to win", 12,2,7)
 print("collect $"..win_creds,
 						5,12,11)
 spr(35,7,19) 
 print(win_heals.."x heals",16,21,8)
 print("iceberg never",6,30,6)
 print("shrinks",18,39)
 --print("blah",2,49,7)
 print("❎ to start",10,58,7)
end
__gfx__
0000000000000000070007000000000000077000000000000700000005dddddd77777777ddddddddd77777770000c3c3333300000000933333cc000005dddddd
00000000700070000070007000000000077007700007777070000000577777777777777777777777d7777777003ccc3333333300009ff93333cccc0057777777
00700700070007000070007000777700700000070070000000077000d77777777777777777777777d77777770ccccff33333cc9009ffff9333ccccc0d7777777
00077000070007000007000707000070000000000700000000700000d77777777777777777777777d77777770cccffcc3ccc99f00ffff9333cccccc0d7777777
00077000070007000007000700000000000770000700007700700000d77777777777777777777777d7777777ccccffccc3cccfffccff99cc3cccccccd7777777
00700700070007000070007000000000077007700700070000000000d77777777777777777777777d7777777ccccccffcccfffffccc99cccccccccccd7777777
00000000700070000070007000777700700000070700700000000000d77777777777777777777777d7777777cccccffffffffcffcccc993c33ccccccd7777777
00000000000000000700070007000070000000000000700000000000d77777777777777777777777d7777777ccccfffffffffccfcccccc3cccccccccd7777777
00600600006006000001100000011000606006060000000000000000005ddddd77777777dd5005ddd7777777cccccff9999fffcfccccccc3c33ccccc005ddddd
0016610000d66d00006116000061160060166106000000000000000005d777777777777777d55d77d7777777cccccc9333399ccccccccccc33333ccc05d77777
006666000061160000199100001991006066660600000000000000005d7777777777c777777dd7775d7777773ccccccc3339ccccccccccc3333333cc5d777777
00066000500660050016910000169100606116060000000000000000d7777777777cdc777777777705d7777733cccccc3333cc3cccccccc9333333ccd7777777
00677600066776600116611011166111600660060000000000000000d777777777cdcdc77777777705d77777033cccccc9339c300ccccccc93333cc0d7777777
06677660006776000166661000666600666776660000000000000000d7777777777c7c77777777775d777777033cccccc999ccc00cccccccf333ccc0d7777777
05666650006666000166661000666600667777600000000000000000d77777777777777777777777d77777770033cccccc9ccc0000cccccccf33cc00d7777777
00600600006006000090090000900900067777600000000000000000d77777777777777777777777d77777770000cccccccc00000000ccccc93c0000d7777777
0000000000000000000670000000000000677600000000000000000000055ddd77777777d5000005d7777777000033333cc300000000ccc33333000000055ddd
00000000009900000700607000088000006776000110011000000000055dd777777777777d50505d5d77777700333333cccc3300003cc33333333300055dd777
0b6bbbb00944aa00006076000008800006777760111111110000000005d777777777c77777d5d5d705d777770933333ccccccc3003c333333333333005d77777
036b33b0094a99a076766006088888800677776011111111000000005d777777777cdc77777d7d77005d77770f993c3cccccccc00c333399993999305d777777
0b6bbbb0009a99a060066767088888800676676001111110000000005d77777777cdcdc77777777705d777779fff3cccccccccccc33999ffff9fff935d777777
033333300000aa000067060000088000066006600011110000000000d77777777cdcdcdc7777777705d77777fff333ccc3cccccc339fffffffffff93d7777777
00000000000000000706007000088000660000660001100000000000d777777777c7c7c77777777705d77777ff3333cc3ccccccc99fffffffff99933d7777777
00000000000000000007600000000000600000060000000000000000d777777777777777777777775d777777fffcc3cc3ccccccccc99cfffff933333d7777777
000000000000000000000000000000000000000000000000000000000000000000000000aaaaaaaaaaaaaaaaff93ccc33cccccccffffffffff93333c00000000
0006600000066000000660000006600000066000000660000006600000066000000060009a9999a99a9999a9f9333c3ccccccccccffff99ff93333cc00000000
006ff600006ff600006ff6000066660000666600006666000066f0000066f0000006d60099a99a9999a99a9933333cccccccccccfcfffccf933c333c00000000
0006600000066000000660000006600000066000000660000006600000066000006d5d609199991991999919333cccccccccccccfccfffcc93ccc33c00000000
000440000014400000044100000440000014400000044100000440000004410006d5d5d6999889999999999903c3cccc3cccccc00fcffffcc3ccccc000000000
001441000004200000024000001441000004400000044000000410000004400000606060998888999988889903ccccc3ccccccc00fccffcccccc3c3000000000
0002200000020000000020000002200000020000000020000002200000200200000000004998899499999999003ccccc3ccccc0000fccccccccc330000000000
0000000000000000000000000000000000000000000000000000000000000000000000000499994044444444000033cccccc00000000cccccccc000000000000
0000aaa00000aaa00000aaa0aaa00000aaa00000aaa000000000a0000000a00000000aaa00000aaa000000000000000000000000000000000000000000000000
00aaaa0000aaaa0000aaaa000aaaa0000aaaa0000aaaa000000aa000000aa0000aaaaaa00aaaaaa0000000000000000000007777000000000000000000000000
00999000009990000099900000aaa00000aaa00000aaa00000099000000990000999999009999990000000000000000000777777700000000000000000000000
00999000009990000099900000999000009990000099900000099000000990000919919009199190000000000000000007777777770000000000000000000000
01727100017271000172710001111100011111000111110000018000000180000999999009999990000000000000000077777777777000000000000000000000
0118110000181f000f1810000111110000111100011110000001700000011f000988889009888890000000000000000077777677777000000000000000000000
0f1a1f00005a1000001a50000f111f0000111f000f111000000f1000000110000498894004999940000000000000000777776777777700000000000000000000
00505000000050000050000000505000000050000050000000055000005005000049940000444400000000000000000777777777777700000000000000000000
0000aaa00000a00088811a0000811a0000001a0008811a0080001a000000000080001a0008811a00000000000000007777777777777700000000000000000000
00aaaa0000aaaa00777114008871140080011400877114007881140000000000788d140087711400000000000000007777777777777770000000000000000000
0099900000999a00888884007788840078811400788884008771140000000000877d140078888400000000000000077777777777677777000000000000000000
00999000009990007777740088777400877884008777740078888400000000007888840087777400000000000000777777777777677777000000000000000000
01727100017271000000040077000400788774007000040007777400000000000777740070000400000000000000777767777777667777700000000000000000
f1181100f11811000000040000000400077004000000040000000400000000000000040000000400000000000007777767777777767777700000000000000000
001a1f00001a1f000000040000000400000004000000040000000400000000000000040000000400000000000007777767777777776777770000000000000000
00505000005050000000040000000400000004000000040000000400000000000000040000000400000000000077777677777777776677770000000000000000
00400000800000000040004000000000000000000000000000000000000000000000000000000000000000000077776677777667777667777000000000000000
00090400000090000009080000000000000000000000000000000000000000000000000000000000000000000077766777777767777776777700000000000000
800a9000009090040809009000000000000000000000000000000000000000000000000000000000000000000777777777777777777777777777000000000000
090a9090000aa940049aa90000000000000000000000000000000000000000000000000000000000000000000776777777777777777777777777777000000000
09a9a99000a97800009a790000000000000000000000000000000000000000000000000000000000000000007777777777777777767777777777777700000000
0097a900089aa9000007a90000000000000000000000000000000000000000000000000000000000000000007777777777667777667777777767777700000000
000a7000000a7000000a700000000000000000000000000000000000000000000000000000000000000000006777777777766777777777766677777600000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000006667777777777777777777777777766000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000006666677777777777777777777666600000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000666666667777777776666666600000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066666666666666666666666000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066666666666666666666600000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006666666666666666666000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000666666666666666600000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000066666666666666000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000666666666600000000000000000000000
77707770777077007770770077700000777000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
07007000700070707000707070000000007000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
07007000770077707700770070000000777000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
07007000700070707000707070700000700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
77707770777077007770707077700000777000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
70707700070077707070000007007770000077707070777000007700070077000000000000000000000000000000000000000000000000000000000000000000
70707070707007007070000070707000000007007070700000007070707070700000000000000000000000000000000000000000000000000000000000000000
70707700707007007770000070707700000007007770770000007070707070700000000000000000000000000000000000000000000000000000000000000000
77707070777007007070000070707000000007007070700000007070707070700000000000000000000000000000000000000000000000000000000000000000
70707070707007007070000007007000000007007070777000007700070070700000000000000000000000000000000000000000000000000000000000000000
__label__
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddd111111dddd1111dd111111dd111111dd111111dd111111dddd1111dddddddddd111111dddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddd111111dddd1111dd111111dd111111dd111111dd111111dddd1111dddddddddd111111dddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddd11dddd11dddddd11dddddd11dd11dd11dddddd11dd11dd11dddddddddddddddddd11dddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddd11dddd11dddddd11dddddd11dd11dd11dddddd11dd11dd11dddddddddddddddddd11dddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddd11dddd11dddddd1111dddd1111dddd1111dddd1111dddd11dddddddddddddd111111dddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddd11dddd11dddddd1111dddd1111dddd1111dddd1111dddd11dddddddddddddd111111dddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddd11dddd11dddddd11dddddd11dd11dd11dddddd11dd11dd11dd11dddddddddd11dddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddd11dddd11dddddd11dddddd11dd11dd11dddddd11dd11dd11dd11dddddddddd11dddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddd111111dddd1111dd111111dd111111dd111111dd11dd11dd111111dddddddddd111111dddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddd111111dddd1111dd111111dd111111dd111111dd11dd11dd111111dddddddddd111111dddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd66666655dddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd66666655dddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddd6666665566666655dddddddddddddddddddddddddddddddddddddddddd66666666665555dddddddddddddd
dddddddddddddddddddddddddddddddddddddddddd6666665566666655dddddddddddddddddddddddddddddddddddddddddd66666666665555dddddddddddddd
dddddddddddd6666665555dddddddddddddddddd66666666666666666655aaaaaadddddddddddddddddddddddd666666556666666666666655dddddddddddddd
dddddddddddd6666665555dddddddddddddddddd66666666666666666655aaaaaadddddddddddddddddddddddd666666556666666666666655dddddddddddddd
5555dddd6666666666666655dddddddddddddd66668866666611aa66aaaaaaaa55dddddddddddddddddddd666666666666666666666666665555dddddddddddd
5555dddd6666666666666655dddddddddddddd66668866666611aa66aaaaaaaa55dddddddddddddddddddd666666666666666666666666665555dddddddddddd
6655dddd666666666666665555dddddddd6666666677888811114466999999666655dddddddddddddddd666666666666666666666666666655556666665555dd
6655dddd666666666666665555dddddddd6666666677888811114466999999666655dddddddddddddddd666666666666666666666666666655556666665555dd
6655556666666666666666665555dddd66666666668877771111446699999966665555dddddddddddd6666666666666666556666666666556666666666666655
6655556666666666666666665555dddd66666666668877771111446699999966665555dddddddddddd6666666666666666556666666666556666666666666655
6655556666666666666666665555dd666666665566778888888844117722771166665555dddddddd666666666666666666665566666655556666666666666655
6655556666666666666666665555dd666666665566778888888844117722771166665555dddddddd666666666666666666665566666655556666666666666655
5555556666666666666666665555dd6666666666556677777777ff111188111166665555dddddddd666666666666666666665555555555666666666666666666
5555556666666666666666665555dd6666666666556677777777ff111188111166665555dddddddd666666666666666666665555555555666666666666666666
5555dd5566666666666666555555dd6666666666555555555566446611aa11ff66665555dddddddd666655666666666666665555555555666666666666666666
5555dd5566666666666666555555dd6666666666555555555566446611aa11ff66665555dddddddd666655666666666666665555555555666666666666666666
5555dd5566666666666666555555dd556666666666555555555544775577557777555555dddddddd55665566666666666666555555dddd666666666666666666
5555dd5566666666666666555555dd556666666666555555555544775577557777555555dddddddd55665566666666666666555555dddd666666666666666666
dddddddd555566666655555555dddddd55666666555555dddd7744777777777777775555dddddddddd5566555566666655555555dddddd556666666666666655
dddddddd555566666655555555dddddd55666666555555dddd7744777777777777775555dddddddddd5566555566666655555555dddddd556666666666666655
dddddddddd55555555555555dddddddd55555555555555dd7777777777777777777777dddddddddddd55555555555555555555dddddddd556666666666666655
dddddddddd55555555555555dddddddd55555555555555dd7777777777777777777777dddddddddddd55555555555555555555dddddddd556666666666666655
dddddddddddd5555555555dddddddddddddd555555dddddd7777777777667777777777dddddddddddddddd55555555555555dddddddddddd5555666666555555
dddddddddddd5555555555dddddddddddddd555555dddddd7777777777667777777777dddddddddddddddd55555555555555dddddddddddd5555666666555555
dddddddddddddddddddddddddddddddddddddddddddddd77777777776677777777777777dddddddddddddddddddddddddddddddddddddddddd55555555555555
dddddddddddddddddddddddddddddddddddddddddddddd77777777776677777777777777dddddddddddddddddddddddddddddddddddddddddd55555555555555
dddddddddddddddddddddddddddddddddddddddddddddd77777777777777777777777777dddddddddddddddddddddddddddddddddddddddddddd5555555555dd
dddddddddddddddddddddddddddddddddddddddddddddd77777777777777777777777777dddddddddddddddddddddddddddddddddddddddddddd5555555555dd
dddddddddddddddddddddddddddddddddddddddddddd7777777777777777777777777777dddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddd7777777777777777777777777777dddddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddd777777777777777777777777777777dddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddddd777777777777777777777777777777dddddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddd7777777777777777777777667777777777dddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddddd7777777777777777777777667777777777dddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddd777777777777777777777777667777777777dddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddd777777777777777777777777667777777777dddddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddd77777777667777777777777766667777777777dddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddddd77777777667777777777777766667777777777dddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddd7777777777667777777777777777667777777777dddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddd7777777777667777777777777777667777777777dddddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddd777777777766777777777777777777667777777777dddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddddd777777777766777777777777777777667777777777dddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddd77777777776677777777777777777777666677777777dddddddddddddddddddddddddddddddddddddddddddddddd
dddddddddddddddddddddddddddddddddddd77777777776677777777777777777777666677777777dddddddddddddddddddddddddddddddddddddddddddddddd
cccccccccccccccccccccccccccccccccccc7777777766667777777777666677777777666677777777cccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccc7777777766667777777777666677777777666677777777cccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccc777777666677777777777777667777777777776677777777cccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccc777777666677777777777777667777777777776677777777cccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccc777777777777777777777777777777777777777777777777777777cccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccc777777777777777777777777777777777777777777777777777777cccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccc777766777777777777777777777777777777777777777777777777777777cccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccc777766777777777777777777777777777777777777777777777777777777cccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc7777777777777777777777777777777777667777777777777777777777777777cccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc7777777777777777777777777777777777667777777777777777777777777777cccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc7777777777777777777766667777777766667777777777777777667777777777cccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc7777777777777777777766667777777766667777777777777777667777777777cccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc6677777777777777777777666677777777777777777777666666777777777766cccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc6677777777777777777777666677777777777777777777666666777777777766cccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc66666677777777777777777777777777777777777777777777777777776666cccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc66666677777777777777777777777777777777777777777777777777776666cccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc6666666666777777777777777777777777777777777777777766666666cccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccc6666666666777777777777777777777777777777777777777766666666cccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccc66666666666666667777777777777777776666666666666666cccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccc66666666666666667777777777777777776666666666666666cccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccc6666666666666666666666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccc6666666666666666666666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccc666666666666666666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccc666666666666666666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccc66666666666666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccc66666666666666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccc66666666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccc66666666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccc6666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccc6666666666666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccc66666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccc66666666666666666666cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccc22cc22cc222222cc222222cc222222cc22cc22cccccccccccc2222cc222222cccccccccc2222cccccc2222cc2222cccccccccccccc
cccccccccccccccccccccc22cc22cc222222cc222222cc222222cc22cc22cccccccccccc2222cc222222cccccccccc2222cccccc2222cc2222cccccccccccccc
cccccccccccccccccccccc22cc22cc22cc22cc22cc22cccc22cccc22cc22cccccccccc22cc22cc22cccccccccccccc22cc22cc22cc22cc22cc22cccccccccccc
cccccccccccccccccccccc22cc22cc22cc22cc22cc22cccc22cccc22cc22cccccccccc22cc22cc22cccccccccccccc22cc22cc22cc22cc22cc22cccccccccccc
cccccccccccccccccccccc22cc22cc2222cccc222222cccc22cccc222222cccccccccc22cc22cc2222cccccccccccc22cc22cc22cc22cc22cc22cccccccccccc
cccccccccccccccccccccc22cc22cc2222cccc222222cccc22cccc222222cccccccccc22cc22cc2222cccccccccccc22cc22cc22cc22cc22cc22cccccccccccc
cccccccccccccccccccccc222222cc22cc22cc22cc22cccc22cccc22cc22cccccccccc22cc22cc22cccccccccccccc22cc22cc22cc22cc22cc22cccccccccccc
cccccccccccccccccccccc222222cc22cc22cc22cc22cccc22cccc22cc22cccccccccc22cc22cc22cccccccccccccc22cc22cc22cc22cc22cc22cccccccccccc
cccccccccccccccccccccc222222cc22cc22cc22cc22cccc22cccc22cc22cccccccccc2222cccc22cccccccccccccc222222cc2222cccc22cc22cccccccccccc
cccccccccccccccccccccc222222cc22cc22cc22cc22cccc22cccc22cc22cccccccccc2222cccc22cccccccccccccc222222cc2222cccc22cc22cccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc
cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc

__sfx__
0003000010453104532b4531d4531a45317453134530f4530b4530845306453014530040300403004030040300403004030040300403004030040300403004030040300403004030040300403004030040300403
000800001e7551b7551a7551775521755217551070511705107050e70509705007050070500705007050070500705007050070500705007050070500705007050070500705007050070500705007050070500705
00040000332333a2333323336233382333c2333f2333a203002030020300203002030020300203002030020300203002030020300203002030020300203002030020300203002030020300203002030020300203
000c03091e54120541285011454110541015011454110541015010050100501005010050100501005010050100501005010050100501005010050100501005010050100501005010050100501005010050100501
000a000022620286202e6202662020620006000060000600006000060000600006000060000600006000060000600006000060000600006000060000600006000060000600006000060000600006000060000600
00080000251532f1532e1030000300003000030000300003000030000300003000030000300003000030000300003000030000300003000030000300003000030000300003000030000300003000030000300003
0003000036550325302f5202b5302c530395503b55000500005000050000500005000050000500005000050000500005000050000500005000050000500005000050000500005000050000500005000050000500
001000001a51308503015030000300003000030000300003000030000300003000030000300003000030000300003000030000300003000030000300003000030000300003000030000300003000030000300003
000600001313517135361353d13500105001050010500105001050010500105001050010500105001050010500105001050010500105001050010500105001050010500105001050010500105001050010500105
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
00100010000000000000000000001c1041c1041c1041c631336410060100601006010060100601006010060100601006010060100601006010060100601006010060100601006010060100601006010060100000
001000080e4131f4031f4031f4030e413004030040300403004030040300403004030040300403004030040300403004030040300403004030040300403004030040300403004030040300403004030040300403
0010001012064010040c0641f004150641f0041f0641f0041f0641f004110641c0040b0641c0041c0640000400004000040000400004000040000400004000040000400004000040000400004000040000400004
000b000018201022010320105201082010c2010e20125201262010020100201002010020100201002010020100201002010020100201002010020100201002010020100201002010020100201002010020100201
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
001000200c0550c0550c0550c0550c0550c0550c0550c05507055070550705507055070550705507055070550a0550a0550505505055070550705503055030550105501055010550105501055010550105501055
__music__
03 0a0b0c49
03 140b4344
00 41424344
00 41424344
00 41424344
03 544c4344

