'use client';

import { useState } from 'react';

import JsonDisplay from '@/components/common/json-display';
import MarkdownEditor, { MarkdownData } from '@/components/markdown/markdown-editor';

export default function Page() {
	const [content, setContent] = useState<MarkdownData>({
		text: '',
		files: [],
	});

	return (
		<div className="p-8 h-full overflow-y-auto">
			<JsonDisplay
				json={{
					mods: '[]',
					name: 'HH67 ',
					tick: '0.0',
					wave: '1',
					build: '146',
					rules:
						'{attackMode:true,attributes:{},bannedUnits:{values:[mega,horizon]},enemyCoreBuildRadius:560,objectives:[],spawns:[{type:dagger,end:10,max:30,scaling:2,effect:none},{type:crawler,begin:4,end:13,scaling:1.5,amount:2,effect:none},{type:mace,begin:7,end:30,spacing:3,scaling:2,effect:none},{type:dagger,begin:11,spacing:2,max:4,scaling:1.7,shieldScaling:25,effect:none},{type:dagger,begin:12,spacing:2,max:14,scaling:1,shieldScaling:20,amount:4,effect:none},{type:flare,begin:12,end:16,scaling:1,effect:none},{type:pulsar,begin:13,spacing:3,max:25,scaling:0.5,effect:none},{type:flare,begin:16,spacing:2,max:20,scaling:1,shieldScaling:20,effect:none},{type:mace,begin:28,end:40,spacing:3,scaling:1,shieldScaling:20,effect:none},{type:atrax,begin:31,spacing:3,scaling:1,shieldScaling:10,amount:4,effect:none},{type:nova,begin:35,end:60,spacing:3,amount:4,effect:overdrive,items:{item:blast-compound,amount:60}},{type:fortress,begin:40,spacing:5,max:20,scaling:2,shieldScaling:30,amount:2,effect:none},{type:horizon,begin:40,spacing:2,scaling:2,shieldScaling:20,amount:2,effect:none},{type:scepter,begin:41,spacing:30,scaling:1,shieldScaling:30,effect:none},{type:pulsar,begin:41,spacing:5,max:25,scaling:3,shields:640,effect:none},{type:dagger,begin:42,end:130,spacing:3,max:30,amount:4,effect:overdrive,items:{item:pyratite,amount:100}},{type:spiroct,begin:45,spacing:3,max:10,scaling:1,shields:100,shieldScaling:30,effect:overdrive},{type:flare,begin:50,spacing:5,max:20,scaling:3,shields:100,shieldScaling:10,amount:4,effect:overdrive},{type:zenith,begin:50,spacing:5,max:16,scaling:3,shieldScaling:30,amount:2,effect:none},{type:nova,begin:53,spacing:4,scaling:3,shieldScaling:30,amount:2,effect:none},{type:reign,begin:81,spacing:40,scaling:1,shieldScaling:30,effect:none},{type:quasar,begin:82,spacing:3,scaling:3,shieldScaling:30,amount:4,effect:overdrive},{type:horizon,begin:90,spacing:4,scaling:3,shields:40,shieldScaling:30,amount:2,effect:none},{type:vela,begin:100,spacing:30,scaling:1,shieldScaling:30,effect:none},{type:pulsar,begin:120,spacing:2,scaling:3,amount:5,effect:overdrive},{type:antumbra,begin:120,spacing:40,scaling:1,shieldScaling:30,effect:none},{type:corvus,begin:145,spacing:35,scaling:1,shields:100,shieldScaling:30,effect:none},{type:toxopid,begin:210,spacing:35,scaling:1,shields:1000,shieldScaling:35,effect:none}],teams:{0:{},1:{},2:{infiniteAmmo:true},3:{},4:{},5:{}},weather:[{cooldown:170067.64,maxDuration:54000,maxFrequency:216000,minDuration:18000,minFrequency:72000,weather:rain},{cooldown:118048.81,maxDuration:37800,maxFrequency:151200,minDuration:12600,minFrequency:50400,weather:sporestorm}]}',
					saved: '1745722642924',
					stats: '{}',
					width: '300',
					author: '',
					height: '300',
					mapname: 'Không xác định',
					nocores: 'true',
					viewpos: '(0.0,0.0)',
					playtime: '0',
					wavetime: '0.0',
					genfilters:
						'[{class:scatter,block:boulder,chance:0.015,flooronto:stone},{class:scatter,block:boulder,chance:0.015,flooronto:crater-stone},{class:scatter,block:boulder,chance:0.015,flooronto:char},{class:scatter,block:basalt-boulder,chance:0.015,flooronto:basalt},{class:scatter,block:basalt-boulder,chance:0.015,flooronto:hotrock},{class:scatter,block:basalt-boulder,chance:0.015,flooronto:magmarock},{class:scatter,block:sand-boulder,chance:0.015,flooronto:sand-floor},{class:scatter,block:basalt-boulder,chance:0.015,flooronto:darksand},{class:scatter,block:dacite-boulder,chance:0.015,flooronto:dacite},{class:scatter,block:rhyolite-boulder,chance:0.015,flooronto:rhyolite},{class:scatter,block:rhyolite-boulder,chance:0.015,flooronto:rough-rhyolite},{class:scatter,block:yellow-stone-boulder,chance:0.015,flooronto:regolith},{class:scatter,block:yellow-stone-boulder,chance:0.015,flooronto:yellow-stone},{class:scatter,block:carbon-boulder,chance:0.015,flooronto:carbon-stone},{class:scatter,block:ferric-boulder,chance:0.015,flooronto:ferric-stone},{class:scatter,block:ferric-boulder,chance:0.015,flooronto:ferric-craters},{class:scatter,block:beryllic-boulder,chance:0.015,flooronto:beryllic-stone},{class:scatter,block:crystalline-boulder,chance:0.015,flooronto:crystalline-stone},{class:scatter,block:yellow-stone-boulder,chance:0.015,flooronto:yellow-stone-plates},{class:scatter,block:red-stone-boulder,chance:0.015,flooronto:red-stone},{class:scatter,block:red-stone-boulder,chance:0.015,flooronto:dense-red-stone},{class:scatter,block:red-ice-boulder,chance:0.015,flooronto:red-ice},{class:scatter,block:arkyic-boulder,chance:0.015,flooronto:arkyic-stone},{class:scatter,block:redweed,chance:0.015,flooronto:redmat},{class:scatter,block:pur-bush,chance:0.015,flooronto:bluemat},{class:scatter,block:snow-boulder,chance:0.015,flooronto:salt},{class:scatter,block:snow-boulder,chance:0.015,flooronto:snow},{class:scatter,block:snow-boulder,chance:0.015,flooronto:ice},{class:scatter,block:snow-boulder,chance:0.015,flooronto:ice-snow},{class:scatter,block:shale-boulder,chance:0.015,flooronto:shale},{class:ore,falloff:0.29999998,octaves:1.98,scl:22.454998,threshold:0.85999995},{class:ore,falloff:0.29999998,octaves:1.98,ore:ore-lead,scl:24.949999,threshold:0.835},{class:ore,falloff:0.29999998,octaves:1.98,ore:ore-coal,scl:24.949999,threshold:0.89},{class:ore,falloff:0.29999998,octaves:1.98,ore:ore-titanium,scl:24.949999,threshold:0.89},{class:ore,falloff:0.29999998,octaves:1.98,ore:ore-thorium,scl:24.949999,threshold:0.91499996}]',
					playerteam: '1',
					description: '',
					controlledType: 'null',
				}}
			/>
			{/* <MarkdownEditor value={content} onChange={(value) => setContent(value(content))} /> */}
		</div>
	);
}
