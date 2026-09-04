export type NodeKind = 'person' | 'organization' | 'location' | 'kingdom' | 'concept';

export type RelationType =
  | 'core'
  | 'member'
  | 'leads'
  | 'governs'
  | 'based-in'
  | 'family'
  | 'supports'
  | 'military'
  | 'allied'
  | 'hostile'
  | 'part-of'
  | 'related';

export interface GraphNode {
  id: string;
  name: string;
  kind: NodeKind;
  group: string;
  summary: string;
  tags: string[];
  importance: 1 | 2 | 3 | 4 | 5;
}

export interface GraphLink {
  source: string;
  target: string;
  type: RelationType;
  label: string;
  weight: 1 | 2 | 3;
}

export const progress = {
  id: 'wendy-glider',
  label: '温蒂测试飞行设备（滑翔之翼）',
  spoilerRule: '只展示此进度之前已经明确的人物、组织、地点、国家与关系。',
} as const;

export const nodes: GraphNode[] = [
  { id: 'roland', name: '罗兰·温布顿', kind: 'person', group: 'never-winter', summary: '灰堡四王子，无冬城核心领导者；以工程、工业、军事和行政体系推动领地发展。', tags: ['核心', '王室', '无冬城'], importance: 5 },
  { id: 'anna', name: '安娜', kind: 'person', group: 'witch-union', summary: '罗兰最早接纳的女巫之一，也是无冬城工业与技术体系中的核心成员。', tags: ['女巫', '工业', '核心'], importance: 5 },
  { id: 'nightingale', name: '夜莺', kind: 'person', group: 'witch-union', summary: '女巫联盟核心成员，长期承担罗兰身边的护卫、侦察与安全职责。', tags: ['女巫', '护卫', '侦察'], importance: 5 },
  { id: 'wendy', name: '温蒂', kind: 'person', group: 'witch-union', summary: '女巫联盟的重要组织者，擅长操纵风；当前进度已参与滑翔之翼测试。', tags: ['女巫', '女巫联盟', '风'], importance: 5 },
  { id: 'scroll', name: '书卷', kind: 'person', group: 'witch-union', summary: '女巫联盟成员，在教育、记录和知识传递方面承担重要工作。', tags: ['女巫', '教育', '记录'], importance: 4 },
  { id: 'nana', name: '娜娜瓦·派恩', kind: 'person', group: 'witch-union', summary: '拥有治疗能力的女巫，是无冬城医疗保障体系中的关键人物。', tags: ['女巫', '治疗'], importance: 4 },
  { id: 'lightning', name: '闪电', kind: 'person', group: 'witch-union', summary: '擅长飞行与探索的女巫，经常承担空中侦察和探索任务。', tags: ['女巫', '飞行', '侦察'], importance: 4 },
  { id: 'maggie', name: '麦茜', kind: 'person', group: 'witch-union', summary: '具备高机动能力的女巫，常与闪电配合执行侦察、传讯等任务。', tags: ['女巫', '空中支援'], importance: 4 },
  { id: 'lily', name: '莉莉', kind: 'person', group: 'witch-union', summary: '女巫联盟成员，能力与食物保存、微小生命活动相关。', tags: ['女巫', '后勤'], importance: 3 },
  { id: 'mystery-moon', name: '谜月', kind: 'person', group: 'witch-union', summary: '女巫联盟成员，能力与磁化有关。', tags: ['女巫', '磁化'], importance: 3 },
  { id: 'soraya', name: '索罗娅', kind: 'person', group: 'witch-union', summary: '女巫联盟成员，绘画与复制能力在工程图样、宣传和材料制作中很实用。', tags: ['女巫', '绘图'], importance: 4 },
  { id: 'leaf', name: '叶子', kind: 'person', group: 'witch-union', summary: '女巫联盟成员，能力与植物生长和操控密切相关。', tags: ['女巫', '植物'], importance: 4 },
  { id: 'hummingbird', name: '蜂鸟', kind: 'person', group: 'witch-union', summary: '女巫联盟成员，能力可改变物体重量，在运输和工程中很有价值。', tags: ['女巫', '运输'], importance: 3 },
  { id: 'echo', name: '回音', kind: 'person', group: 'witch-union', summary: '来自极南境的女巫，擅长声音模仿与声音相关能力。', tags: ['女巫', '极南境', '声音'], importance: 3 },
  { id: 'agatha', name: '爱葛莎', kind: 'person', group: 'ancient-witch', summary: '来自古代女巫文明背景的重要女巫；当前图谱仅保留已经明确的身份层级。', tags: ['女巫', '古代女巫'], importance: 4 },

  { id: 'tilly', name: '提莉·温布顿', kind: 'person', group: 'sleeping-island', summary: '罗兰的妹妹，沉睡岛女巫群体的核心领导者。', tags: ['王室', '女巫', '沉睡岛'], importance: 5 },
  { id: 'ashes', name: '灰烬', kind: 'person', group: 'sleeping-island', summary: '沉睡岛阵营核心战斗女巫，与提莉关系紧密。', tags: ['女巫', '沉睡岛', '战斗'], importance: 4 },
  { id: 'andrea', name: '安德莉亚', kind: 'person', group: 'sleeping-island', summary: '沉睡岛女巫成员，擅长远距离精准攻击。', tags: ['女巫', '沉睡岛', '战斗'], importance: 4 },
  { id: 'no-76', name: '76号', kind: 'person', group: 'sleeping-island', summary: '当前进度已经抵达无冬城的重要女巫人物；图谱不展开其后续身份信息。', tags: ['女巫', '沉睡岛', '当前剧情'], importance: 4 },

  { id: 'barov', name: '巴罗夫', kind: 'person', group: 'city-hall', summary: '罗兰的重要行政助手，长期负责财政、行政和市政体系运转。', tags: ['市政厅', '行政'], importance: 5 },
  { id: 'carter', name: '卡特·兰尼斯', kind: 'person', group: 'military', summary: '罗兰的首席骑士之一，承担护卫、治安及多项军事相关事务。', tags: ['骑士', '军务'], importance: 4 },
  { id: 'iron-axe', name: '铁斧', kind: 'person', group: 'military', summary: '第一军的重要军事指挥者，来自极南境。', tags: ['第一军', '指挥', '极南境'], importance: 5 },
  { id: 'karl', name: '卡尔·梵伯特', kind: 'person', group: 'city-hall', summary: '石匠出身，参与教育、城建与工程体系，是无冬城建设的重要技术人员。', tags: ['建设', '教育', '市政'], importance: 3 },
  { id: 'kyle', name: '凯尔·西奇', kind: 'person', group: 'industry', summary: '炼金术师，负责化学与相关技术研究，对工业化推进作用很大。', tags: ['炼金', '化学', '工业'], importance: 4 },

  { id: 'goron', name: '戈隆·温布顿', kind: 'person', group: 'royal-family', summary: '灰堡大王子，争王令中的王室成员。', tags: ['王室', '灰堡'], importance: 2 },
  { id: 'timothy', name: '提费科·温布顿', kind: 'person', group: 'royal-family', summary: '灰堡二王子，争王令中的主要竞争者之一；当前进度中已被罗兰击败。', tags: ['王室', '灰堡', '争王令'], importance: 4 },
  { id: 'garcia', name: '嘉西亚·温布顿', kind: 'person', group: 'royal-family', summary: '灰堡三王女，自立势力并参与争王令。', tags: ['王室', '灰堡', '争王令'], importance: 4 },

  { id: 'witch-union', name: '女巫联盟', kind: 'organization', group: 'witch-union', summary: '罗兰治下的核心女巫组织，成员能力被系统用于工业、医疗、侦察、农业、教育等领域。', tags: ['组织', '女巫', '无冬城'], importance: 5 },
  { id: 'city-hall', name: '市政厅', kind: 'organization', group: 'city-hall', summary: '无冬城行政中枢，承接财政、人口、建设、教育、生产组织等日常治理职能。', tags: ['组织', '行政', '无冬城'], importance: 5 },
  { id: 'first-army', name: '第一军', kind: 'organization', group: 'military', summary: '罗兰建立的主要正规军事力量，是无冬城防务与对外军事行动的核心。', tags: ['组织', '军事', '无冬城'], importance: 5 },
  { id: 'alchemy-lab', name: '炼金实验体系', kind: 'organization', group: 'industry', summary: '围绕凯尔等炼金师建立的研究与生产体系，为化学工业和军工提供支撑。', tags: ['组织', '炼金', '工业'], importance: 3 },
  { id: 'sleeping-island-witches', name: '沉睡岛女巫', kind: 'organization', group: 'sleeping-island', summary: '以提莉为核心聚集的女巫群体，与无冬城女巫联盟存在紧密联系与合作。', tags: ['组织', '女巫', '沉睡岛'], importance: 5 },
  { id: 'graycastle-royal-family', name: '温布顿王室', kind: 'organization', group: 'royal-family', summary: '灰堡王室家族，是争王令以及罗兰、提莉等人物关系的重要政治背景。', tags: ['王室', '灰堡'], importance: 4 },
  { id: 'church', name: '教会', kind: 'organization', group: 'church', summary: '以赫尔梅斯为核心的强大宗教与军事势力，与女巫群体和四大王国的政治格局都有直接冲突。', tags: ['组织', '教会', '敌对势力'], importance: 5 },
  { id: 'judgment-army', name: '审判军', kind: 'organization', group: 'church', summary: '教会的常规武装力量之一。', tags: ['教会', '军事'], importance: 4 },
  { id: 'gods-punishment-army', name: '神罚军', kind: 'organization', group: 'church', summary: '教会掌握的特殊军事力量；当前图谱只展示已明确的组织关系。', tags: ['教会', '军事'], importance: 5 },

  { id: 'never-winter', name: '无冬城', kind: 'location', group: 'never-winter', summary: '罗兰势力的政治、工业和军事中心，由原边陲镇发展而来。', tags: ['地点', '西境', '核心'], importance: 5 },
  { id: 'longsong', name: '长歌要塞', kind: 'location', group: 'graycastle', summary: '灰堡西境的重要城市与传统政治中心之一。', tags: ['地点', '灰堡', '西境'], importance: 3 },
  { id: 'sleeping-island', name: '沉睡岛', kind: 'location', group: 'sleeping-island', summary: '提莉及沉睡岛女巫的重要据点，位于峡湾区域。', tags: ['地点', '峡湾', '女巫'], importance: 4 },
  { id: 'third-border-district', name: '第三边陲区', kind: 'location', group: 'ancient-witch', summary: '当前剧情中已经进入视野的重要区域，与古代女巫相关线索相连；不展开后续信息。', tags: ['地点', '古代女巫', '当前剧情'], importance: 4 },
  { id: 'hermes', name: '赫尔梅斯', kind: 'location', group: 'church', summary: '教会核心所在区域，也是四大王国政治与战争格局中的关键地点。', tags: ['地点', '教会'], importance: 5 },
  { id: 'fjords', name: '峡湾群岛', kind: 'location', group: 'geography', summary: '大陆以东的重要群岛区域，贸易、航海和探险活动活跃，沉睡岛位于这一地理体系中。', tags: ['地点', '海洋', '群岛'], importance: 3 },

  { id: 'four-kingdoms', name: '四大王国', kind: 'concept', group: 'kingdoms', summary: '大陆人类世界的四个主要王国：灰堡、晨曦、狼心、永冬。', tags: ['国家体系'], importance: 5 },
  { id: 'graycastle', name: '灰堡王国', kind: 'kingdom', group: 'kingdoms', summary: '四大王国之一，罗兰和温布顿王室所在国家。', tags: ['王国', '灰堡'], importance: 5 },
  { id: 'dawn', name: '晨曦王国', kind: 'kingdom', group: 'kingdoms', summary: '四大王国之一，以商业与富庶闻名。', tags: ['王国', '晨曦'], importance: 3 },
  { id: 'wolfheart', name: '狼心王国', kind: 'kingdom', group: 'kingdoms', summary: '四大王国之一，位于大陆东部一带。', tags: ['王国', '狼心'], importance: 3 },
  { id: 'everwinter', name: '永冬王国', kind: 'kingdom', group: 'kingdoms', summary: '四大王国之一，北方寒冷王国。', tags: ['王国', '永冬'], importance: 3 },
];

export const links: GraphLink[] = [
  { source: 'roland', target: 'never-winter', type: 'governs', label: '核心统治与建设', weight: 3 },
  { source: 'roland', target: 'witch-union', type: 'core', label: '建立并支持', weight: 3 },
  { source: 'roland', target: 'city-hall', type: 'governs', label: '行政体系', weight: 3 },
  { source: 'roland', target: 'first-army', type: 'military', label: '建立并统辖', weight: 3 },
  { source: 'roland', target: 'graycastle-royal-family', type: 'family', label: '温布顿王室成员', weight: 2 },
  { source: 'roland', target: 'third-border-district', type: 'related', label: '当前剧情相关线索', weight: 1 },

  { source: 'anna', target: 'roland', type: 'core', label: '高度信任 / 核心伙伴', weight: 3 },
  { source: 'nightingale', target: 'roland', type: 'supports', label: '护卫与侦察', weight: 3 },
  { source: 'wendy', target: 'roland', type: 'supports', label: '女巫组织与能力支援', weight: 2 },

  ...['anna', 'nightingale', 'wendy', 'scroll', 'nana', 'lightning', 'maggie', 'lily', 'mystery-moon', 'soraya', 'leaf', 'hummingbird', 'echo', 'agatha'].map((source) => ({ source, target: 'witch-union', type: 'member' as const, label: '女巫联盟成员', weight: 2 as const })),

  { source: 'barov', target: 'city-hall', type: 'leads', label: '核心行政负责人', weight: 3 },
  { source: 'karl', target: 'city-hall', type: 'supports', label: '建设与教育', weight: 2 },
  { source: 'city-hall', target: 'never-winter', type: 'governs', label: '城市行政管理', weight: 3 },
  { source: 'iron-axe', target: 'first-army', type: 'leads', label: '军事指挥', weight: 3 },
  { source: 'carter', target: 'roland', type: 'military', label: '首席骑士 / 护卫', weight: 2 },
  { source: 'first-army', target: 'never-winter', type: 'based-in', label: '核心军事力量', weight: 3 },
  { source: 'kyle', target: 'alchemy-lab', type: 'leads', label: '炼金与化学研究', weight: 3 },
  { source: 'alchemy-lab', target: 'never-winter', type: 'supports', label: '工业技术支援', weight: 2 },
  { source: 'witch-union', target: 'never-winter', type: 'based-in', label: '主要活动据点', weight: 3 },

  { source: 'tilly', target: 'sleeping-island-witches', type: 'leads', label: '核心领导者', weight: 3 },
  ...['ashes', 'andrea', 'no-76'].map((source) => ({ source, target: 'sleeping-island-witches', type: 'member' as const, label: '沉睡岛女巫成员', weight: 2 as const })),
  { source: 'sleeping-island-witches', target: 'sleeping-island', type: 'based-in', label: '主要据点', weight: 3 },
  { source: 'sleeping-island', target: 'fjords', type: 'part-of', label: '位于峡湾区域', weight: 2 },
  { source: 'sleeping-island-witches', target: 'witch-union', type: 'allied', label: '合作与交流', weight: 2 },
  { source: 'tilly', target: 'roland', type: 'family', label: '兄妹', weight: 3 },
  { source: 'ashes', target: 'tilly', type: 'supports', label: '核心伙伴', weight: 3 },

  ...['roland', 'tilly', 'goron', 'timothy', 'garcia'].map((source) => ({ source, target: 'graycastle-royal-family', type: 'member' as const, label: '王室成员', weight: 2 as const })),
  { source: 'graycastle-royal-family', target: 'graycastle', type: 'part-of', label: '灰堡王室', weight: 3 },
  { source: 'roland', target: 'timothy', type: 'hostile', label: '争王令政治对手', weight: 2 },
  { source: 'roland', target: 'garcia', type: 'hostile', label: '争王令政治竞争关系', weight: 1 },

  { source: 'church', target: 'hermes', type: 'based-in', label: '核心据点', weight: 3 },
  { source: 'judgment-army', target: 'church', type: 'part-of', label: '教会武装', weight: 3 },
  { source: 'gods-punishment-army', target: 'church', type: 'part-of', label: '教会特殊武装', weight: 3 },
  { source: 'church', target: 'witch-union', type: 'hostile', label: '根本性敌对', weight: 3 },
  { source: 'church', target: 'sleeping-island-witches', type: 'hostile', label: '根本性敌对', weight: 3 },
  { source: 'church', target: 'graycastle', type: 'hostile', label: '政治与军事冲突', weight: 2 },

  { source: 'graycastle', target: 'four-kingdoms', type: 'member', label: '四大王国之一', weight: 3 },
  { source: 'dawn', target: 'four-kingdoms', type: 'member', label: '四大王国之一', weight: 3 },
  { source: 'wolfheart', target: 'four-kingdoms', type: 'member', label: '四大王国之一', weight: 3 },
  { source: 'everwinter', target: 'four-kingdoms', type: 'member', label: '四大王国之一', weight: 3 },
  { source: 'never-winter', target: 'graycastle', type: 'part-of', label: '灰堡西境核心城市', weight: 3 },
  { source: 'longsong', target: 'graycastle', type: 'part-of', label: '灰堡西境城市', weight: 2 },
];

export const kindLabels: Record<NodeKind, string> = {
  person: '人物',
  organization: '组织',
  location: '地点',
  kingdom: '王国',
  concept: '体系',
};

export const relationLabels: Record<RelationType, string> = {
  core: '核心关系',
  member: '成员',
  leads: '领导',
  governs: '治理 / 管辖',
  'based-in': '驻地 / 位于',
  family: '家族',
  supports: '协作 / 支援',
  military: '军事',
  allied: '合作 / 同盟',
  hostile: '敌对',
  'part-of': '隶属 / 组成',
  related: '相关线索',
};
