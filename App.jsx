import React, { useState, useRef, useEffect } from 'react';

const GEMINI_MODEL = 'gemini-3.1-pro-preview';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const RELIGION_CONFIG = {
  christian: {
    name: '기독교', icon: '✝️', color: 'amber',
    patterns: [
      { id: 1, name: '스토리텔링형', desc: '실제 사례나 감동적인 이야기로 시작' },
      { id: 2, name: '질문 폭격형', desc: '연속 질문으로 시청자 호기심 자극' },
      { id: 3, name: '대조법형', desc: '상반된 상황을 대비시켜 메시지 강조' },
      { id: 4, name: '통계/팩트형', desc: '놀라운 수치나 사실로 주목 끌기' },
      { id: 5, name: '성경 인물형', desc: '성경 속 인물의 이야기로 시작' },
      { id: 6, name: '상상해보세요형', desc: '"상상해보세요..."로 몰입 유도' },
      { id: 7, name: '목사 고백형', desc: '목사의 개인적 경험/고백으로 시작' },
      { id: 8, name: '역설형', desc: '예상을 뒤집는 역설적 진술' },
      { id: 9, name: '시간여행형', desc: '과거/미래 시점에서 이야기 시작' },
      { id: 10, name: '현실 밀착형', desc: '일상적인 현실 상황에서 공감 유도' }
    ],
    artStyles: [
      { id: 'photorealistic', label: '포토리얼', icon: '📷' },
      { id: 'renaissance', label: '르네상스', icon: '🖼️' },
      { id: 'baroque', label: '바로크', icon: '🏛️' },
      { id: 'stained-glass', label: '스테인드글라스', icon: '⛪' },
      { id: 'cinematic', label: '시네마틱', icon: '🎬' }
    ],
    moods: [
      { id: 'hopeful', label: '희망적', icon: '🌟' },
      { id: 'dramatic', label: '드라마틱', icon: '🌙' },
      { id: 'warm', label: '따뜻한', icon: '🧡' },
      { id: 'reverent', label: '경건한', icon: '🙏' },
      { id: 'intense', label: '강렬한', icon: '⚡' }
    ],
    subjects: [
      { id: 'jesus-alone', label: '예수님 단독', icon: '✝️' },
      { id: 'jesus-people', label: '예수님+사람들', icon: '👥' },
      { id: 'biblical', label: '성경 인물', icon: '📖' },
      { id: 'modern-prayer', label: '현대인 기도', icon: '🧎' },
      { id: 'biblical-place', label: '성경 장소', icon: '🏛️' },
      { id: 'nature-light', label: '자연+빛', icon: '🌅' },
      { id: 'church', label: '교회/성당', icon: '⛪' }
    ],
    quickButtons: [
      { label: '🎯 후킹', value: 'hooking' }, { label: '🏛️ 경건', value: 'reverent' },
      { label: '💧 감동', value: 'touching' }, { label: '🧡 따뜻', value: 'warm' },
      { label: '⚡ 강렬', value: 'intense' }, { label: '🧎 간절', value: 'earnest' },
      { label: '🌈 희망', value: 'hopeful' }, { label: '📖 성경적', value: 'biblical' }
    ],
    promptRole: 'YouTube 콘텐츠 전문 목사이자 스크립트 작가입니다. 15년 목회 경험과 조회수 100만+ 달성 전문가입니다.',
    scriptTerms: { leader: '목사', scripture: '성경', deity: '하나님/예수님', place: '교회', prayer: '기도문', follower: '권사님/집사님' },
    honorifics: ['사랑하는 성도 여러분', '믿음의 가족 여러분']
  },
  buddhist: {
    name: '불교', icon: '☸️', color: 'purple',
    patterns: [
      { id: 1, name: '스토리텔링형', desc: '실제 사례나 감동적인 이야기로 시작' },
      { id: 2, name: '질문 폭격형', desc: '연속 질문으로 시청자 호기심 자극' },
      { id: 3, name: '대조법형', desc: '상반된 상황을 대비시켜 메시지 강조' },
      { id: 4, name: '통계/팩트형', desc: '놀라운 수치나 사실로 주목 끌기' },
      { id: 5, name: '부처님 이야기형', desc: '부처님/보살님의 가르침으로 시작' },
      { id: 6, name: '상상해보세요형', desc: '"상상해보세요..."로 몰입 유도' },
      { id: 7, name: '스님 법문형', desc: '스님의 지혜로운 법문으로 시작' },
      { id: 8, name: '역설형', desc: '예상을 뒤집는 역설적 진술' },
      { id: 9, name: '전생/윤회형', desc: '전생 이야기나 인연으로 시작' },
      { id: 10, name: '현실 밀착형', desc: '일상적인 현실 상황에서 공감 유도' }
    ],
    artStyles: [
      { id: 'oriental', label: '동양화', icon: '🎨' },
      { id: 'thangka', label: '탱화', icon: '🖼️' },
      { id: 'zen', label: '선화(禪畫)', icon: '🖌️' },
      { id: 'ink-wash', label: '수묵화', icon: '🏔️' },
      { id: 'temple-photo', label: '사찰 사진풍', icon: '📷' }
    ],
    moods: [
      { id: 'peaceful', label: '평화로운', icon: '☮️' },
      { id: 'meditative', label: '선적인', icon: '🧘' },
      { id: 'enlightened', label: '깨달음', icon: '💫' },
      { id: 'compassionate', label: '자비로운', icon: '🙏' },
      { id: 'serene', label: '고요한', icon: '🌸' }
    ],
    subjects: [
      { id: 'buddha', label: '부처님', icon: '☸️' },
      { id: 'bodhisattva', label: '보살님', icon: '🪷' },
      { id: 'monk', label: '스님', icon: '👨‍🦲' },
      { id: 'temple', label: '사찰', icon: '🏯' },
      { id: 'lotus', label: '연꽃', icon: '🪷' },
      { id: 'nature-zen', label: '자연/선경', icon: '🌿' },
      { id: 'meditation', label: '명상하는 사람', icon: '🧘' }
    ],
    quickButtons: [
      { label: '🎯 후킹', value: 'hooking' }, { label: '☮️ 평화', value: 'peaceful' },
      { label: '💧 감동', value: 'touching' }, { label: '🙏 자비', value: 'compassionate' },
      { label: '🧘 선적', value: 'meditative' }, { label: '🪷 깨달음', value: 'enlightened' },
      { label: '🌸 고요', value: 'serene' }, { label: '📿 불경적', value: 'scriptural' }
    ],
    promptRole: 'YouTube 콘텐츠 전문 스님이자 불교 스크립트 작가입니다. 20년 수행 경험과 조회수 100만+ 달성 전문가입니다.',
    scriptTerms: { leader: '스님', scripture: '불경/경전', deity: '부처님/보살님', place: '사찰/절', prayer: '발원문', follower: '보살님/신도님' },
    honorifics: ['부처님의 자녀 여러분', '도반 여러분']
  }
};

const STEPS = [
  { num: 1, label: '제목 입력' }, { num: 2, label: '제목 선택' }, { num: 3, label: '패턴 선택' },
  { num: 4, label: '스크립트' }, { num: 5, label: '설명/이미지' }, { num: 6, label: '결과' }
];

const WORD_COUNTS = [{ label: '5,000자', value: 5000 }, { label: '10,000자', value: 10000 }, { label: '20,000자', value: 20000 }, { label: '25,000자', value: 25000 }];

const CHAPTERS = [
  { id: 'intro', label: '도입부' }, { id: 'body1', label: '본문 1' }, { id: 'body2', label: '본문 2' },
  { id: 'body3', label: '본문 3' }, { id: 'body4', label: '본문 4' }, { id: 'body5', label: '본문 5' },
  { id: 'body6', label: '본문 6' }, { id: 'body7', label: '본문 7' }, { id: 'prayer', label: '통합 기도문/발원문' }, { id: 'outro', label: '마무리' }
];

const BODY_STYLES = [
  { id: 'basic', name: '📋 기본', desc: '문제→경전→해석→적용→사례→기도→격려' },
  { id: 'story', name: '📖 스토리 중심', desc: '사례/간증 비중 높음' },
  { id: 'doctrine', name: '✝️ 교리 중심', desc: '경전 해석 비중 높음' },
  { id: 'emotional', name: '💧 감성 중심', desc: '감정 묘사 비중 높음' },
  { id: 'dialogue', name: '💬 대화형', desc: '질문/답변 비중 높음' },
  { id: 'custom', name: '⚙️ 직접 설정', desc: '요소를 직접 선택' }
];

const BODY_ELEMENTS = {
  start: [{ id: 'case', label: '사례/간증' }, { id: 'emotion', label: '감정 묘사' }, { id: 'dialogue', label: '대화 장면' }, { id: 'flashback', label: '회상' }, { id: 'situation', label: '상황 설정' }, { id: 'question', label: '질문 시작' }],
  develop: [{ id: 'scripture', label: '경전 해석' }, { id: 'history', label: '역사적 배경' }, { id: 'metaphor', label: '비유 설명' }, { id: 'modern', label: '현대 적용' }, { id: 'contrast', label: '대비/대조' }, { id: 'expert', label: '전문가 의견' }],
  end: [{ id: 'shortprayer', label: '짧은 기도' }, { id: 'questionend', label: '질문 던지기' }, { id: 'encourage', label: '격려' }, { id: 'confession', label: '고백/다짐' }, { id: 'preview', label: '다음 예고' }]
};

const STYLE_PRESETS = {
  story: { start: ['case', 'flashback', 'dialogue'], develop: ['scripture', 'modern', 'metaphor'], end: ['shortprayer', 'encourage', 'confession'] },
  doctrine: { start: ['question', 'situation', 'case'], develop: ['scripture', 'history', 'expert'], end: ['shortprayer', 'questionend', 'encourage'] },
  emotional: { start: ['emotion', 'flashback', 'case'], develop: ['metaphor', 'modern', 'scripture'], end: ['encourage', 'confession', 'shortprayer'] },
  dialogue: { start: ['question', 'dialogue', 'case'], develop: ['contrast', 'modern', 'scripture'], end: ['questionend', 'encourage', 'preview'] }
};

const REGEN_OPTIONS = [{ id: 'aggressive', label: '더 자극적으로' }, { id: 'soft', label: '더 부드럽게' }, { id: 'shorter', label: '더 짧게' }, { id: 'keyword', label: '특정 키워드 강조' }, { id: 'custom', label: '직접 입력' }];

// 유틸리티 함수들
const parseJSON = (r) => {
  try {
    const m = r.match(/\{[\s\S]*\}/) || r.match(/\[[\s\S]*\]/);
    return m ? JSON.parse(m[0]) : null;
  } catch { return null; }
};

const getCharCount = (text) => (text || '').replace(/\s/g, '').length;

export default function App() {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKeyScreen, setShowApiKeyScreen] = useState(false);
  const [religion, setReligion] = useState('');
  const [titleMode, setTitleMode] = useState('');
  const [seoSubMode, setSeoSubMode] = useState('');
  const [title, setTitle] = useState('');
  const [seoTitles, setSeoTitles] = useState(['', '', '']);
  const [genTitles, setGenTitles] = useState([]);
  const [keywordAnalysis, setKeywordAnalysis] = useState('');
  const [selTitleIdx, setSelTitleIdx] = useState(null);
  const [showTitleRegen, setShowTitleRegen] = useState(false);
  const [titleRegenOption, setTitleRegenOption] = useState('');
  const [titleRegenText, setTitleRegenText] = useState('');
  const [copied, setCopied] = useState({});
  const [step, setStep] = useState(1);
  const [selPatterns, setSelPatterns] = useState([]);
  const [wordCount, setWordCount] = useState(10000);
  const [bodyStyle, setBodyStyle] = useState('basic');
  const [autoVariation, setAutoVariation] = useState(true);
  const [customElements, setCustomElements] = useState({ start: ['case', 'emotion', 'dialogue'], develop: ['scripture', 'modern', 'metaphor'], end: ['shortprayer', 'encourage', 'questionend'] });
  const [scripts, setScripts] = useState({});
  const [selChapter, setSelChapter] = useState('intro');
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('');
  const [regenModal, setRegenModal] = useState(false);
  const [regenReq, setRegenReq] = useState('');
  const [lengthAdjustModal, setLengthAdjustModal] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const [lengthAdjustRatio, setLengthAdjustRatio] = useState(0);
  const [lengthAdjustLoading, setLengthAdjustLoading] = useState(false);
  const [ytDesc, setYtDesc] = useState('');
  const [imgMode, setImgMode] = useState('auto');
  const [artStyle, setArtStyle] = useState('');
  const [mood, setMood] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [imgPrompts, setImgPrompts] = useState([]);
  const [refImgs, setRefImgs] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [ytLoading, setYtLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileRef = useRef(null);

  const config = RELIGION_CONFIG[religion] || {};
  const isBuddhist = religion === 'buddhist';
  const accent = isBuddhist ? 'purple' : 'amber';

  // 스타일 헬퍼
  const cls = {
    text: isBuddhist ? 'text-purple-400' : 'text-amber-400',
    bg: isBuddhist ? 'bg-purple-500' : 'bg-amber-500',
    border: isBuddhist ? 'border-purple-500' : 'border-amber-500',
    card: `bg-slate-800/50 border ${isBuddhist ? 'border-purple-500/30' : 'border-amber-500/30'} rounded-xl`,
    goldBtn: `bg-gradient-to-r ${isBuddhist ? 'from-purple-500 to-pink-500' : 'from-amber-500 to-yellow-500'} text-slate-900 font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-all`,
    outlineBtn: `border ${isBuddhist ? 'border-purple-500/50 text-purple-400 hover:bg-purple-500/10' : 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10'} py-2 px-4 rounded-lg transition-all`,
    selected: isBuddhist ? 'bg-purple-500/30 border-purple-500' : 'bg-amber-500/30 border-amber-500'
  };

  useEffect(() => {
    if (religion) {
      const c = RELIGION_CONFIG[religion];
      setArtStyle(c.artStyles[0]?.id || '');
      setMood(c.moods[0]?.id || '');
      setSubjects(c.subjects.slice(0, 2).map(s => s.id));
    }
  }, [religion]);

  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('gemini-api-key');
      if (savedKey) setApiKey(savedKey);
      const result = localStorage.getItem('script-history');
      if (result) setHistory(JSON.parse(result));
    } catch {}
  }, []);

  // 통합 복사 함수
  const copy = (text, key) => {
    // 방법 1: Clipboard API 시도
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopied(p => ({ ...p, [key]: true }));
          setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
        })
        .catch(() => {
          // 실패시 방법 2 사용
          fallbackCopy(text, key);
        });
    } else {
      // Clipboard API 미지원시 방법 2 사용
      fallbackCopy(text, key);
    }
  };

  // 대체 복사 함수 (textarea 방식)
  const fallbackCopy = (text, key) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
      document.execCommand('copy');
      setCopied(p => ({ ...p, [key]: true }));
      setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
      alert('복사에 실패했습니다. 텍스트를 직접 선택해서 복사해주세요.');
    } finally {
      document.body.removeChild(textarea);
    }
  };

  // 히스토리 관리
  const saveToHistory = async (scriptData) => {
    const newEntry = {
      id: Date.now(), date: new Date().toLocaleString('ko-KR'), religion,
      originalTitle: title || seoTitles.filter(t => t).join(' + '),
      selectedTitle: genTitles[selTitleIdx],
      patterns: selPatterns.map(id => config.patterns?.find(p => p.id === id)?.name),
      wordCount, scripts: scriptData,
      totalChars: Object.values(scriptData).reduce((sum, s) => sum + getCharCount(s), 0),
      ytDesc, imgPrompts
    };
    const updated = [newEntry, ...history].slice(0, 20);
    setHistory(updated);
    try { localStorage.setItem('script-history', JSON.stringify(updated)); } catch {}
  };

  const loadFromHistory = (entry) => {
    setReligion(entry.religion || 'christian');
    setTitle(entry.originalTitle);
    setGenTitles([entry.selectedTitle]);
    setSelTitleIdx(0);
    const c = RELIGION_CONFIG[entry.religion || 'christian'];
    setSelPatterns(entry.patterns?.map(name => c.patterns.find(p => p.name === name)?.id).filter(Boolean) || []);
    setWordCount(entry.wordCount);
    setScripts(entry.scripts);
    setYtDesc(entry.ytDesc || '');
    setImgPrompts(entry.imgPrompts || []);
    setStep(4);
    setShowHistory(false);
  };

  const deleteFromHistory = async (id) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    try { localStorage.setItem('script-history', JSON.stringify(updated)); } catch {}
  };

  const resetAll = () => {
    setStep(1); setTitleMode(''); setSeoSubMode(''); setTitle(''); setSeoTitles(['', '', '']);
    setGenTitles([]); setKeywordAnalysis(''); setSelTitleIdx(null); setSelPatterns([]);
    setWordCount(10000); setBodyStyle('basic'); setAutoVariation(true);
    setCustomElements({ start: ['case', 'emotion', 'dialogue'], develop: ['scripture', 'modern', 'metaphor'], end: ['shortprayer', 'encourage', 'questionend'] });
    setScripts({}); setSelChapter('intro'); setEditMode(false);
    setYtDesc(''); setImgPrompts([]); setRefImgs([]); setAnalysis('');
    setShowResetConfirm(false); setReligion('');
  };

  // Gemini API 호출
  const callAPI = async (prompt, sys = '', images = null, retries = 2) => {
    const key = apiKey || localStorage.getItem('gemini-api-key') || '';
    if (!key) return '오류: API 키가 설정되지 않았습니다.';

    const url = `${GEMINI_API_BASE}/${GEMINI_MODEL}:generateContent?key=${key}`;

    // 메시지 파트 구성
    const parts = [];
    if (images && images.length > 0) {
      images.forEach(img => {
        parts.push({ inlineData: { mimeType: img.type, data: img.data } });
      });
    }
    parts.push({ text: sys ? `${sys}\n\n${prompt}` : prompt });

    const body = {
      contents: [{ role: 'user', parts }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 1.0,
        thinkingConfig: { thinkingBudget: 2048 }
      }
    };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const msg = errData?.error?.message || res.status;
          if (attempt < retries) { await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); continue; }
          return `오류: API 응답 실패 (${msg})`;
        }
        const data = await res.json();
        // thinking 파트 제외, 실제 응답 텍스트만 추출
        const parts_resp = data?.candidates?.[0]?.content?.parts || [];
        const text = parts_resp
          .filter(p => !p.thought)
          .map(p => p.text || '')
          .join('');
        if (!text) return '오류: 응답 내용이 비어있습니다.';
        return text;
      } catch (e) {
        if (attempt < retries) { await new Promise(r => setTimeout(r, 1000 * (attempt + 1))); continue; }
        return '오류: ' + e.message;
      }
    }
  };

  // 통합 제목 생성 함수
  const genTitles_fn = async (regenOpt = '', regenTxt = '') => {
    setLoading(true);
    const sys = `당신은 종교, 영성 분야에서 100만 조회수를 기록하는 유튜브 제목 전문 카피라이터입니다. 반드시 JSON 형식으로만 응답하세요.`;
    const optMap = { aggressive: '더 자극적이고 클릭을 유발하는 방향으로', soft: '더 부드럽고 따뜻한 느낌으로', shorter: '더 짧고 간결하게', keyword: `"${regenTxt}" 키워드를 강조해서`, custom: regenTxt };
    
    let prompt = `종교: ${config.name}\n`;
    if (titleMode === 'views') {
      prompt += `사용자 입력 주제: "${title}"\n\n위 주제를 바탕으로 다음 5가지 패턴을 각각 1개씩 적용하여 제목 5개를 만드세요:\n1. 수동적/편안함 강조형\n2. 부정/경고/오해 해결형\n3. 구체적 행동/숫자형\n4. 특정 상황/타이밍 타겟형\n5. 극적인 결과 약속형`;
    } else if (seoSubMode === 'single') {
      prompt += `기존 영상 제목: "${seoTitles[0]}"\n\n[목표] 새로 생성한 제목으로 유튜브에서 검색했을 때, 위 기존 영상이 "연관 콘텐츠"로 상위 노출되어야 합니다.\n\n[분석 요청]\n1. 기존 제목에서 검색 노출에 핵심이 되는 키워드를 추출하세요\n2. 해당 키워드들을 100% 포함하면서 새로운 제목 5개를 생성하세요`;
    } else {
      const valid = seoTitles.filter(t => t.trim());
      prompt += `기존 영상 제목들:\n${valid.map((t, i) => `영상 ${String.fromCharCode(65 + i)}: ${t}`).join('\n')}\n\n[목표] 새로 생성한 제목으로 유튜브에서 검색했을 때, 위 기존 영상들이 모두 "연관 콘텐츠"로 상위 노출되어야 합니다.`;
    }
    prompt += `\n\n핵심 키워드에 작은따옴표('') 사용.`;
    if (regenOpt) prompt += `\n\n추가 요청: ${optMap[regenOpt]}`;
    prompt += `\n\n반드시 아래 JSON 형식으로만 응답하세요:\n{"analysis": "분석 내용", "titles": ["제목1", "제목2", "제목3", "제목4", "제목5"]}`;
    
    const r = await callAPI(prompt, sys);
    const parsed = parseJSON(r);
    if (parsed?.analysis) setKeywordAnalysis(parsed.analysis);
    setGenTitles(parsed?.titles || (Array.isArray(parsed) ? parsed : [r]));
    setLoading(false); setShowTitleRegen(false); setTitleRegenOption(''); setTitleRegenText('');
  };

  const canGenerate = () => titleMode === 'views' ? title.trim() : seoSubMode === 'single' ? seoTitles[0].trim() : seoTitles[0].trim() && seoTitles[1].trim();

  // 스크립트 생성
  const genScripts = async () => {
    setLoading(true);
    const pats = selPatterns.map(id => config.patterns?.find(p => p.id === id)?.name).join(', ');
    const selTitle = genTitles[selTitleIdx];
    const target = wordCount;
    const scaled = { intro: Math.round(target * 0.08), body: Math.round(target * 0.11), prayer: Math.round(target * 0.05), outro: Math.round(target * 0.10) };
    const sys = `당신은 ${config.promptRole}`;
    const terms = config.scriptTerms;
    let newScripts = {};

    const scriptureRef = religion === 'christian' ? '성경 구절 인용 (예: 요한복음 3장 16절)' : '불경/경전 구절 인용 (예: 반야심경, 금강경)';
    const personFormat = religion === 'christian' ? '"52세 박미영 권사님은"' : '"52세 김연화 보살님은"';
    const honorificGuide = `청자 호칭은 "${config.honorifics?.join('" 또는 "')}"를 자연스럽게 섞어서 사용하세요.`;

    const getBodyElements = (num) => {
      const el = bodyStyle === 'custom' ? customElements : STYLE_PRESETS[bodyStyle] || customElements;
      if (autoVariation) {
        const pick = arr => arr[Math.floor(Math.random() * arr.length)];
        return { start: BODY_ELEMENTS.start.find(e => e.id === pick(el.start)), develop: BODY_ELEMENTS.develop.find(e => e.id === pick(el.develop)), end: BODY_ELEMENTS.end.find(e => e.id === pick(el.end)) };
      }
      return { start: BODY_ELEMENTS.start.find(e => e.id === el.start[0]), develop: BODY_ELEMENTS.develop.find(e => e.id === el.develop[0]), end: BODY_ELEMENTS.end.find(e => e.id === el.end[0]) };
    };

    const baseInstructions = `중요 지침:\n- ${honorificGuide}\n- 소제목 절대 사용 금지\n- 마크다운 기호 사용 금지\n- 자연스럽게 흘러가는 문장으로만 작성\n- 인물 소개 시 ${personFormat} 형식으로 작성`;

    setProgress('1/4 도입부 생성 중...');
    const r1 = await callAPI(`제목: "${selTitle}"\n종교: ${config.name}\n도입부 패턴: ${pats}\n\n도입부를 약 ${scaled.intro}자 내외(공백제외)로 작성하세요.\n\n선택된 패턴(${pats})을 적용하여 작성\n${baseInstructions}`, sys);
    newScripts.intro = r1; setScripts(p => ({ ...p, intro: r1 }));

    // 포인트 자동 배분 안내
    const distributionGuide = `[중요: 포인트 자동 배분 규칙]
- 제목에서 언급된 포인트 수(예: "5가지 기도", "3가지 축복", "7가지 감사")를 파악하세요.
- 전체 본문 7개에 맞게 자동 배분합니다:
  * 포인트가 7개 미만인 경우: 각 포인트를 본문 1개씩 다루고, 남는 본문은 "종합 정리", "공통점 분석", "실천 방법", "심화 적용", "실제 간증 모음" 등으로 채웁니다.
  * 포인트가 7개인 경우: 각 본문에 1개씩 배분합니다.
  * 포인트가 7개 초과인 경우: 일부 본문에서 2개 포인트를 합쳐서 다룹니다.
- 본문 번호와 포인트 번호를 명확히 매칭하여 작성하세요.\n\n`;

    // 본문 1~3 생성
    setProgress('2/4 본문 1~3 생성 중...');
    let p2 = `제목: "${selTitle}"\n종교: ${config.name}\n\n${distributionGuide}본문 1, 2, 3을 각각 약 ${scaled.body}자 내외(공백제외)로 작성하세요.\n\n`;
    if (bodyStyle !== 'basic') {
      [1,2,3].forEach(n => { const el = getBodyElements(n); p2 += `[본문 ${n}] 시작: ${el.start?.label}, 전개: ${el.develop?.label}, 마무리: ${el.end?.label}\n`; });
    }
    p2 += `${scriptureRef}를 자연스럽게 포함하세요.\n구체적 사례/간증은 2024~2025년 최신으로, 이름/나이/지역을 포함하세요.\n${baseInstructions}\n각 본문 구분은 "## 본문 1", "## 본문 2", "## 본문 3"만 사용`;
    const r2 = await callAPI(p2, sys);
    const parts2 = r2.split(/##\s*본문\s*\d+/i).filter(Boolean);
    [1,2,3].forEach((n, i) => { newScripts[`body${n}`] = parts2[i]?.trim() || ''; });
    setScripts(p => ({ ...p, body1: newScripts.body1, body2: newScripts.body2, body3: newScripts.body3 }));

    // 본문 1~3 요약 생성 (연속성 보장)
    const prevSummary = `[이전 본문 요약 - 중복 방지 필수]\n본문 1: ${(newScripts.body1 || '').substring(0, 200)}...\n본문 2: ${(newScripts.body2 || '').substring(0, 200)}...\n본문 3: ${(newScripts.body3 || '').substring(0, 200)}...\n\n위에서 다룬 포인트와 절대 중복하지 말고, 다음 순서의 포인트 또는 심화/종합 내용으로 작성하세요.\n\n`;

    // 본문 4~6 생성 (이전 내용 참조)
    setProgress('3/4 본문 4~6 생성 중...');
    let p3 = `제목: "${selTitle}"\n종교: ${config.name}\n\n${distributionGuide}${prevSummary}본문 4, 5, 6을 각각 약 ${scaled.body}자 내외(공백제외)로 작성하세요.\n\n`;
    p3 += `[본문 4~6 작성 가이드]\n- 본문 1~3에서 다루지 않은 나머지 포인트를 이어서 작성하세요.\n- 만약 제목의 포인트를 모두 다뤘다면, 본문 4~6은 다음 중에서 선택하여 작성:\n  * "종합 정리: N가지의 공통점과 핵심"\n  * "실천 방법: 일상에서 적용하는 법"\n  * "심화 적용: 더 깊은 의미와 해석"\n  * "실제 간증: 이를 실천한 사람들의 이야기"\n\n`;
    if (bodyStyle !== 'basic') {
      [4,5,6].forEach(n => { const el = getBodyElements(n); p3 += `[본문 ${n}] 시작: ${el.start?.label}, 전개: ${el.develop?.label}, 마무리: ${el.end?.label}\n`; });
    }
    p3 += `${scriptureRef}를 자연스럽게 포함하세요.\n구체적 사례/간증은 2024~2025년 최신으로, 이름/나이/지역을 포함하세요.\n${baseInstructions}\n각 본문 구분은 "## 본문 4", "## 본문 5", "## 본문 6"만 사용`;
    const r3 = await callAPI(p3, sys);
    const parts3 = r3.split(/##\s*본문\s*\d+/i).filter(Boolean);
    [4,5,6].forEach((n, i) => { newScripts[`body${n}`] = parts3[i]?.trim() || ''; });
    setScripts(p => ({ ...p, body4: newScripts.body4, body5: newScripts.body5, body6: newScripts.body6 }));

    setProgress('4/4 본문 7, 기도문/발원문, 마무리 생성 중...');
    const prayerLabel = religion === 'christian' ? '통합 기도문' : '통합 발원문';
    
    // 본문 1~6 요약 (본문 7 연속성 보장)
    const fullSummary = `[이전 본문 요약 - 본문 7은 전체의 절정/마무리입니다]\n본문 1: ${(newScripts.body1 || '').substring(0, 100)}...\n본문 2: ${(newScripts.body2 || '').substring(0, 100)}...\n본문 3: ${(newScripts.body3 || '').substring(0, 100)}...\n본문 4: ${(newScripts.body4 || '').substring(0, 100)}...\n본문 5: ${(newScripts.body5 || '').substring(0, 100)}...\n본문 6: ${(newScripts.body6 || '').substring(0, 100)}...\n\n`;
    
    const p4 = `제목: "${selTitle}"\n종교: ${config.name}\n\n${fullSummary}[본문 7 작성 가이드]\n- 제목의 마지막 포인트가 아직 다뤄지지 않았다면 그것을 작성\n- 모든 포인트가 다뤄졌다면: "최종 결론", "핵심 메시지 강조", "영적 절정과 감동의 클라이맥스"로 작성\n- 가장 감동적이고 강렬한 어조로 마무리\n\n1. 본문 7 (약 ${scaled.body}자) - 위 6개 본문의 절정, 최고조 감정\n2. ${prayerLabel} (약 ${scaled.prayer}자) - 본문 1~7의 모든 포인트를 엮은 ${config.scriptTerms.prayer}\n3. 마무리 (약 ${scaled.outro}자) - 전체 핵심 요약, CTA(좋아요/구독 유도), 축복 인사\n\n${baseInstructions}\n구분은 "## 본문 7", "## ${prayerLabel}", "## 마무리"만 사용`;
    const r4 = await callAPI(p4, sys);
    const body7M = r4.match(/##\s*본문\s*7\s*([\s\S]*?)(?=##\s*통합|$)/i);
    const prayerM = r4.match(/##\s*통합\s*(?:기도문|발원문)\s*([\s\S]*?)(?=##\s*마무리|$)/i);
    const outroM = r4.match(/##\s*마무리\s*([\s\S]*?)$/i);
    newScripts.body7 = body7M?.[1]?.trim() || r4; newScripts.prayer = prayerM?.[1]?.trim() || ''; newScripts.outro = outroM?.[1]?.trim() || '';
    setScripts(p => ({ ...p, body7: newScripts.body7, prayer: newScripts.prayer, outro: newScripts.outro }));

    setProgress(''); setLoading(false); setStep(4);
    await saveToHistory(newScripts);
  };

  const adjustLength = async () => {
    if (!selectedSections.length || !lengthAdjustRatio) return;
    setLengthAdjustLoading(true);
    const selTitle = genTitles[selTitleIdx];
    const personFormat = religion === 'christian' ? '"52세 박미영 권사님은"' : '"52세 김연화 보살님은"';
    const honorificGuide = `청자 호칭은 "${config.honorifics?.join('" 또는 "')}"를 자연스럽게 섞어서 사용하세요.`;
    const ratioText = lengthAdjustRatio > 0 ? `${lengthAdjustRatio}% 더 길게` : `${Math.abs(lengthAdjustRatio)}% 더 짧게`;
    
    for (const sectionId of selectedSections) {
      const curr = scripts[sectionId]; if (!curr) continue;
      const currLen = getCharCount(curr);
      const targetLen = Math.round(currLen * (1 + lengthAdjustRatio / 100));
      const result = await callAPI(`제목: "${selTitle}"\n종교: ${config.name}\n\n현재 "${CHAPTERS.find(c => c.id === sectionId)?.label}" 내용 (${currLen}자):\n${curr}\n\n위 내용을 ${ratioText} 작성해주세요. 목표: 약 ${targetLen}자\n\n- ${honorificGuide}\n- 소제목/마크다운 금지\n- 인물 소개 시 ${personFormat} 형식`);
      setScripts(p => ({ ...p, [sectionId]: result }));
    }
    setLengthAdjustLoading(false); setLengthAdjustModal(false); setSelectedSections([]); setLengthAdjustRatio(0);
  };

  const regenChapter = async () => {
    setRegenModal(false); setRegenLoading(true);
    const selTitle = genTitles[selTitleIdx];
    const personFormat = religion === 'christian' ? '"52세 박미영 권사님은"' : '"52세 김연화 보살님은"';
    const r = await callAPI(`제목: "${selTitle}"\n종교: ${config.name}\n현재 ${CHAPTERS.find(c => c.id === selChapter)?.label} 내용:\n${scripts[selChapter]}\n\n요청: ${regenReq}\n\n소제목/마크다운 금지, 인물 소개 시 ${personFormat} 형식`);
    setScripts(p => ({ ...p, [selChapter]: r })); setRegenReq(''); setRegenLoading(false);
  };

  const quickRegen = async (type) => {
    setRegenLoading(true);
    const typeMap = { hooking: '더 강력한 후킹으로', reverent: '더 경건하게', touching: '더 감동적으로', warm: '더 따뜻하게', intense: '더 강렬하게', earnest: '더 간절하게', hopeful: '더 희망적으로', biblical: '더 성경적으로', peaceful: '더 평화롭게', meditative: '더 선적으로', compassionate: '더 자비롭게', enlightened: '더 깨달음을 주는 방향으로', serene: '더 고요하게', scriptural: '더 불경적으로' };
    const r = await callAPI(`제목: "${genTitles[selTitleIdx]}"\n종교: ${config.name}\n현재 도입부:\n${scripts.intro}\n\n${typeMap[type]} 도입부를 다시 작성해주세요.\n소제목/마크다운 금지, 순수 스크립트만`);
    setScripts(p => ({ ...p, intro: r })); setRegenLoading(false);
  };

  const genYtDesc = async () => {
    setYtLoading(true);
    const r = await callAPI(`제목: "${genTitles[selTitleIdx]}"\n종교: ${config.name}\n\n유튜브 설명 작성:\n- 핵심 메시지 (2-3문장)\n- 내용 요약\n- ${config.name} 해시태그 10개\n- 구독/좋아요 유도\n\n마크다운 없이 순수 텍스트만.`);
    setYtDesc(r); setYtLoading(false);
  };

  const genImgPrompts = async () => {
    setImgLoading(true);
    const styleLabel = config.artStyles?.find(s => s.id === artStyle)?.label || '';
    const moodLabel = config.moods?.find(m => m.id === mood)?.label || '';
    const subjLabels = subjects.map(s => config.subjects?.find(x => x.id === s)?.label).join(', ');
    const religionStyle = religion === 'christian' ? 'Western religious art style, divine golden light' : 'Eastern Buddhist art style, serene temple atmosphere, lotus motifs';
    let prompt = `제목: "${genTitles[selTitleIdx]}"\n종교: ${config.name}\n\n이미지 프롬프트 20개를 생성하세요.\n\n기본 설정:\n- 스타일: ${styleLabel}\n- 분위기: ${moodLabel}\n- 피사체: ${subjLabels}\n- 톤: ${religionStyle}\n\n`;
    prompt += `[필수 포함 요소 - 모든 프롬프트에 반드시 추가]\n"no frame, no border, full bleed, edge-to-edge composition, fills entire canvas"\n→ 액자, 테두리, 여백 없이 화면을 꽉 채우는 이미지\n\n`;
    prompt += `[중요: 다양성 규칙]\n각 프롬프트는 반드시 서로 달라야 합니다:\n1. 카메라 앵글 다양화: close-up, medium shot, wide shot, aerial view, low angle, eye-level 등\n2. 시간대 다양화: golden hour, blue hour, midday, sunset, dawn, night 등\n3. 구도 다양화: centered, rule of thirds, symmetrical, dynamic diagonal 등\n4. 조명 다양화: backlit, side-lit, soft diffused, dramatic chiaroscuro, rim light 등\n5. 감정/분위기 변화: 평화로운, 극적인, 신비로운, 따뜻한, 경건한, 희망찬 등\n6. 환경/배경 변화: 실내, 실외, 자연, 도시, 고대, 현대 등\n\n`;
    if (imgMode === 'ref' && analysis) prompt += `참고 이미지 분석:\n${analysis}\n\n위 스타일을 기반으로 하되, 20개 모두 다른 변형을 적용하세요.\n\n`;
    prompt += `각 프롬프트는 영어로, 16:9 aspect ratio 명시, 고품질 이미지 생성용.\n절대 비슷한 프롬프트 금지 - 20개 모두 확연히 다르게!\nJSON 배열로만 응답: ["prompt1", "prompt2", ...]`;
    const r = await callAPI(prompt);
    const parsed = parseJSON(r);
    setImgPrompts(Array.isArray(parsed) ? parsed : [r]);
    setImgLoading(false);
  };

  const analyzeImages = async () => {
    if (!refImgs.length) return;
    setImgLoading(true);
    const r = await callAPI(`제공한 이미지 초정밀 분석:\n1. 피사체 디테일\n2. 조명/광원\n3. 색감/톤\n4. 카메라 정보\n5. 환경\n6. 분위기\n7. 구성\n\n한국어로 상세히.`, '', refImgs);
    setAnalysis(r); setImgLoading(false);
  };

  const handleFileUpload = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setRefImgs(p => [...p, { data: ev.target.result.split(',')[1], type: file.type, name: file.name }]);
      reader.readAsDataURL(file);
    });
  };

  const getFullScript = () => {
    const prayerLabel = religion === 'christian' ? '통합 기도문' : '통합 발원문';
    return [{ id: 'intro', label: '도입부' }, ...Array(7).fill().map((_, i) => ({ id: `body${i + 1}`, label: `본문 ${i + 1}` })), { id: 'prayer', label: prayerLabel }, { id: 'outro', label: '마무리' }]
      .map(s => `## ${s.label}\n${scripts[s.id] || ''}`).join('\n\n');
  };

  const totalChars = Object.values(scripts).reduce((sum, s) => sum + getCharCount(s), 0);

  // 공통 컴포넌트
  const Modal = ({ show, onClose, title, children, loading: modalLoading }) => show && (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className={`${cls.card} p-6 w-full max-w-md relative`}>
        {modalLoading && <div className="absolute inset-0 bg-slate-900/80 rounded-xl flex flex-col items-center justify-center z-10"><div className={`w-12 h-12 border-4 ${isBuddhist ? 'border-purple-500/30 border-t-purple-500' : 'border-amber-500/30 border-t-amber-500'} rounded-full animate-spin mb-4`}/><p className={`${cls.text} font-bold`}>처리 중...</p></div>}
        <h3 className={`${cls.text} font-bold mb-4`}>{title}</h3>
        {children}
      </div>
    </div>
  );

  const SelectCard = ({ selected, onClick, children, className = '' }) => (
    <div onClick={onClick} className={`p-4 rounded-xl cursor-pointer transition-all ${selected ? `${cls.selected} border-2` : 'bg-slate-700/50 border border-slate-600 hover:border-amber-500/50'} ${className}`}>{children}</div>
  );

  const saveApiKey = () => {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) return;
    localStorage.setItem('gemini-api-key', trimmed);
    setApiKey(trimmed);
    setApiKeyInput('');
    setShowApiKeyScreen(false);
  };

  const clearApiKey = () => {
    localStorage.removeItem('gemini-api-key');
    setApiKey('');
    setShowApiKeyScreen(false);
  };

  // API 키 설정 화면
  if (showApiKeyScreen) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-slate-800/50 border border-slate-600 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-amber-400 mb-2">🔑 Gemini API 키 설정</h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Google AI Studio에서 발급받은 Gemini API 키를 입력하세요.<br />
          키는 브라우저 로컬에만 저장되며 서버로 전송되지 않습니다.
        </p>
        {apiKey && (
          <div className="bg-green-900/30 border border-green-500/40 rounded-xl p-3 mb-4 flex items-center justify-between">
            <span className="text-green-400 text-sm">✅ 현재 키: {apiKey.slice(0, 8)}...{apiKey.slice(-4)}</span>
            <button onClick={clearApiKey} className="text-red-400 text-xs hover:text-red-300 border border-red-500/40 px-2 py-1 rounded-lg">삭제</button>
          </div>
        )}
        <input
          type="text"
          value={apiKeyInput}
          onChange={e => setApiKeyInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && saveApiKey()}
          placeholder="AIzaSy..."
          className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white mb-4 font-mono text-sm"
          autoFocus
        />
        <button
          onClick={saveApiKey}
          disabled={!apiKeyInput.trim()}
          className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 font-bold py-3 rounded-xl mb-3 disabled:opacity-40"
        >
          ✦ 저장하고 시작하기
        </button>
        <button onClick={() => setShowApiKeyScreen(false)} className="w-full border border-slate-600 text-slate-400 py-2 rounded-xl hover:bg-slate-700/50">
          취소
        </button>
        <p className="text-slate-500 text-xs text-center mt-4">
          🔗 키 발급: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-amber-400 underline">aistudio.google.com</a>
        </p>
      </div>
    </div>
  );

  // 종교 미선택
  if (!religion) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-center mb-2">✨ YouTube 스크립트 생성기</h1>
      <p className="text-slate-400 mb-2">종교를 선택하세요</p>
      {/* API 키 상태 표시 */}
      <div className="mb-6">
        {apiKey
          ? <button onClick={() => setShowApiKeyScreen(true)} className="flex items-center gap-2 bg-green-900/30 border border-green-500/40 text-green-400 px-4 py-2 rounded-full text-sm hover:bg-green-900/50">
              ✅ Gemini API 연결됨 ({apiKey.slice(0,8)}...) · 변경
            </button>
          : <button onClick={() => setShowApiKeyScreen(true)} className="flex items-center gap-2 bg-red-900/30 border border-red-500/40 text-red-400 px-4 py-2 rounded-full text-sm hover:bg-red-900/50 animate-pulse">
              ⚠️ API 키 미설정 — 클릭하여 설정
            </button>
        }
      </div>
      <div className="flex gap-6">
        {[{ id: 'christian', icon: '✝️', name: '기독교', desc: '성경, 예수님, 목사, 교회', color: 'amber' }, { id: 'buddhist', icon: '☸️', name: '불교', desc: '불경, 부처님, 스님, 사찰', color: 'purple' }].map(r => (
          <div key={r.id} onClick={() => setReligion(r.id)} className={`cursor-pointer bg-slate-800/50 border border-${r.color}-500/30 rounded-2xl p-8 hover:border-${r.color}-500 hover:bg-${r.color}-500/10 transition-all text-center w-48`}>
            <div className="text-6xl mb-4">{r.icon}</div>
            <h2 className={`text-xl font-bold text-${r.color}-400 mb-2`}>{r.name}</h2>
            <p className="text-slate-400 text-sm">{r.desc}</p>
          </div>
        ))}
      </div>
      <button onClick={() => setShowHistory(true)} className="mt-8 border border-slate-600 text-slate-400 py-2 px-4 rounded-lg hover:bg-slate-700/50">📚 히스토리 ({history.length})</button>
      <Modal show={showHistory} onClose={() => setShowHistory(false)} title="📚 작업 히스토리">
        {history.length === 0 ? <div className="text-center text-slate-400 py-12">저장된 히스토리가 없습니다.</div> : (
          <div className="max-h-96 overflow-y-auto space-y-3">
            {history.map(entry => (
              <div key={entry.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`${entry.religion === 'buddhist' ? 'text-purple-300' : 'text-amber-300'} font-medium line-clamp-1`}>{entry.religion === 'buddhist' ? '☸️' : '✝️'} {entry.selectedTitle}</p>
                    <p className="text-slate-400 text-sm">{entry.date} · {entry.totalChars?.toLocaleString()}자</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => loadFromHistory(entry)} className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-lg text-sm">불러오기</button>
                    <button onClick={() => deleteFromHistory(entry.id)} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm">삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setShowHistory(false)} className="w-full mt-4 border border-slate-600 text-slate-400 py-2 rounded-lg">닫기</button>
      </Modal>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-4">
      <h1 className={`text-2xl font-bold text-center ${cls.text} mb-4`}>{config.icon} {config.name} YouTube 스크립트 생성기</h1>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button onClick={() => setShowHistory(true)} className={cls.outlineBtn}>📚 히스토리 ({history.length})</button>
          <button onClick={() => setReligion('')} className="border border-slate-600 text-slate-400 py-2 px-4 rounded-lg hover:bg-slate-700/50">🔄 종교 변경</button>
          <button onClick={() => setShowApiKeyScreen(true)} className={`border py-2 px-3 rounded-lg text-xs ${apiKey ? 'border-green-500/40 text-green-400 hover:bg-green-500/10' : 'border-red-500/40 text-red-400 hover:bg-red-500/10 animate-pulse'}`}>
            {apiKey ? `🔑 ${apiKey.slice(0,6)}...` : '⚠️ API 키 설정'}
          </button>
        </div>
        {step > 1 && <button onClick={() => setShowResetConfirm(true)} className="border border-red-500/50 text-red-400 py-2 px-4 rounded-lg hover:bg-red-500/10">🔄 처음부터 다시</button>}
      </div>

      {/* Progress Bar */}
      <div className={`${cls.card} p-4 mb-6`}>
        <div className="flex justify-between items-center">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.num ? `${cls.bg} text-slate-900` : 'bg-slate-700 text-slate-400'}`}>{s.num}</div>
              <span className={`ml-2 text-sm hidden sm:inline ${step >= s.num ? cls.text : 'text-slate-500'}`}>{s.label}</span>
              {i < STEPS.length - 1 && <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > s.num ? cls.bg : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <button onClick={() => step > 1 && setStep(step - 1)} className={cls.outlineBtn} disabled={step === 1}>{'< 이전'}</button>
        <button onClick={() => step < 6 && setStep(step + 1)} className={cls.outlineBtn} disabled={step === 6}>{'다음 >'}</button>
      </div>

      {/* Step 1: 제목 입력 */}
      {step === 1 && (
        <div className={cls.card + ' p-6'}>
          {!titleMode ? (
            <>
              <h2 className={`${cls.text} font-bold mb-4`}>✦ 제목 생성 방식 선택</h2>
              <div className="space-y-3">
                <SelectCard onClick={() => setTitleMode('views')}><div className={`font-bold ${cls.text}`}>🎯 조회수 최적화형</div><p className="text-slate-400 text-sm mt-1">주제를 입력하면 5가지 패턴으로 제목 5개 생성</p></SelectCard>
                <SelectCard onClick={() => setTitleMode('seo')}><div className={`font-bold ${cls.text}`}>🔍 SEO 키워드 최적화형 (교차 노출)</div><p className="text-slate-400 text-sm mt-1">기존 제목을 분석하여 교차 노출용 제목 생성</p></SelectCard>
              </div>
            </>
          ) : titleMode === 'views' ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`${cls.text} font-bold`}>🎯 조회수 최적화형</h2>
                <button onClick={() => { setTitleMode(''); setGenTitles([]); setKeywordAnalysis(''); }} className="text-slate-400 text-sm hover:text-amber-400">← 방식 다시 선택</button>
              </div>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`주제를 입력하세요 (예: ${religion === 'christian' ? '성령의 임재' : '마음의 평화'})`} className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white mb-4" />
              {genTitles.length === 0 ? (
                <button onClick={() => genTitles_fn()} disabled={!canGenerate() || loading} className={`w-full ${cls.goldBtn}`}>{loading ? '생성 중...' : '✦ 제목 5개 생성'}</button>
              ) : (
                <>
                  {keywordAnalysis && <div className="bg-blue-900/30 border border-blue-500/40 rounded-xl p-4 mb-4"><h3 className="text-blue-400 font-bold mb-2">📊 키워드 분석</h3><p className="text-blue-200 text-sm whitespace-pre-wrap">{keywordAnalysis}</p></div>}
                  <div className={`${cls.selected.replace('border-2', '')} border rounded-xl p-4 mb-4`}>
                    <h3 className={`${cls.text} font-bold mb-3`}>✨ 생성된 제목 (1개 선택)</h3>
                    <div className="space-y-3">{genTitles.map((t, i) => (
                      <div key={i} className={`p-4 rounded-xl transition-all ${selTitleIdx === i ? `${cls.selected} border-2` : 'bg-slate-800/50 border border-slate-600 hover:border-amber-500/50'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 cursor-pointer" onClick={() => setSelTitleIdx(i)}><span className={`${cls.text} mr-2 font-bold`}>{i + 1}.</span><span className="text-white">{t}</span></div>
                          <button onClick={(e) => { e.stopPropagation(); copy(t, `title-${i}`); }} className={`shrink-0 px-3 py-1 rounded-lg text-sm ${copied[`title-${i}`] ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400 hover:text-amber-400'}`}>{copied[`title-${i}`] ? '✓ 복사됨' : '📋 복사'}</button>
                        </div>
                      </div>
                    ))}</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowTitleRegen(true)} className={`flex-1 ${cls.outlineBtn}`}>🔄 다시 생성하기</button>
                    <button onClick={() => selTitleIdx !== null && setStep(2)} disabled={selTitleIdx === null} className={`flex-1 ${cls.goldBtn}`}>✦ 다음 단계로</button>
                  </div>
                </>
              )}
            </>
          ) : !seoSubMode ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`${cls.text} font-bold`}>🔍 SEO 키워드 최적화형</h2>
                <button onClick={() => setTitleMode('')} className="text-slate-400 text-sm hover:text-amber-400">← 방식 다시 선택</button>
              </div>
              <div className="space-y-3">
                <SelectCard onClick={() => setSeoSubMode('single')}><div className={`font-bold ${cls.text}`}>📝 1개 제목 분석</div><p className="text-slate-400 text-sm mt-1">기존 제목 1개를 최적화된 대안 5개로</p></SelectCard>
                <SelectCard onClick={() => setSeoSubMode('multi')}><div className={`font-bold ${cls.text}`}>🔀 2~3개 제목 조합 (교차 노출)</div><p className="text-slate-400 text-sm mt-1">여러 제목의 키워드를 조합하여 새 제목 생성</p></SelectCard>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`${cls.text} font-bold`}>{seoSubMode === 'single' ? '📝 1개 제목 분석' : '🔀 2~3개 제목 조합'}</h2>
                <button onClick={() => { setSeoSubMode(''); setGenTitles([]); setKeywordAnalysis(''); setSeoTitles(['', '', '']); }} className="text-slate-400 text-sm hover:text-amber-400">← 모드 다시 선택</button>
              </div>
              {seoSubMode === 'single' ? (
                <input type="text" value={seoTitles[0]} onChange={(e) => setSeoTitles([e.target.value, '', ''])} placeholder="분석할 기존 제목을 입력하세요" className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white mb-4" />
              ) : (
                <div className="space-y-3 mb-4">{[0, 1, 2].map(i => <input key={i} type="text" value={seoTitles[i]} onChange={(e) => { const n = [...seoTitles]; n[i] = e.target.value; setSeoTitles(n); }} placeholder={`제목 ${i + 1} ${i < 2 ? '(필수)' : '(선택)'}`} className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white" />)}</div>
              )}
              {genTitles.length === 0 ? (
                <button onClick={() => genTitles_fn()} disabled={!canGenerate() || loading} className={`w-full ${cls.goldBtn}`}>{loading ? '생성 중...' : '✦ 제목 5개 생성'}</button>
              ) : (
                <>
                  <div className="bg-purple-900/30 border border-purple-500/40 rounded-xl p-4 mb-4"><h3 className="text-purple-400 font-bold mb-2 text-sm">📌 입력한 제목</h3><p className="text-purple-200 whitespace-pre-wrap">{seoSubMode === 'single' ? seoTitles[0] : seoTitles.filter(t => t).map((t, i) => `${i + 1}. ${t}`).join('\n')}</p></div>
                  {keywordAnalysis && <div className="bg-blue-900/30 border border-blue-500/40 rounded-xl p-4 mb-4"><h3 className="text-blue-400 font-bold mb-2">📊 키워드 분석</h3><p className="text-blue-200 text-sm whitespace-pre-wrap">{keywordAnalysis}</p></div>}
                  <div className={`${cls.selected.replace('border-2', '')} border rounded-xl p-4 mb-4`}>
                    <h3 className={`${cls.text} font-bold mb-3`}>✨ 생성된 제목 (1개 선택)</h3>
                    <div className="space-y-3">{genTitles.map((t, i) => (
                      <div key={i} className={`p-4 rounded-xl transition-all ${selTitleIdx === i ? `${cls.selected} border-2` : 'bg-slate-800/50 border border-slate-600 hover:border-amber-500/50'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 cursor-pointer" onClick={() => setSelTitleIdx(i)}><span className={`${cls.text} mr-2 font-bold`}>{i + 1}.</span><span className="text-white">{t}</span></div>
                          <button onClick={(e) => { e.stopPropagation(); copy(t, `title-${i}`); }} className={`shrink-0 px-3 py-1 rounded-lg text-sm ${copied[`title-${i}`] ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400 hover:text-amber-400'}`}>{copied[`title-${i}`] ? '✓ 복사됨' : '📋 복사'}</button>
                        </div>
                      </div>
                    ))}</div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowTitleRegen(true)} className={`flex-1 ${cls.outlineBtn}`}>🔄 다시 생성하기</button>
                    <button onClick={() => selTitleIdx !== null && setStep(2)} disabled={selTitleIdx === null} className={`flex-1 ${cls.goldBtn}`}>✦ 다음 단계로</button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Step 2: 제목 확인 */}
      {step === 2 && (
        <div className={cls.card + ' p-6'}>
          <h2 className={`${cls.text} font-bold mb-4`}>✦ 선택된 제목 확인</h2>
          <div className={`${cls.selected} border rounded-xl p-4 mb-4`}><p className={isBuddhist ? 'text-purple-300' : 'text-amber-300'}>{genTitles[selTitleIdx]}</p></div>
          <button onClick={() => setStep(3)} className={`w-full ${cls.goldBtn}`}>✦ 패턴 선택으로</button>
        </div>
      )}

      {/* Step 3: 패턴 선택 */}
      {step === 3 && (
        <div className={cls.card + ' p-6'}>
          <h2 className={`${cls.text} font-bold mb-2`}>✦ 도입부 패턴 (1~3개)</h2>
          <p className="text-slate-400 text-sm mb-4">선택: {genTitles[selTitleIdx]}</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {config.patterns?.map(p => (
              <SelectCard key={p.id} selected={selPatterns.includes(p.id)} onClick={() => selPatterns.includes(p.id) ? setSelPatterns(selPatterns.filter(x => x !== p.id)) : selPatterns.length < 3 && setSelPatterns([...selPatterns, p.id])}>
                <div className="flex items-center justify-between"><span><span className={cls.text + ' mr-2'}>{p.id}</span>{p.name}</span>{selPatterns.includes(p.id) && <span className="text-green-400">✓</span>}</div>
                <p className="text-slate-400 text-xs mt-1">{p.desc}</p>
              </SelectCard>
            ))}
          </div>

          <h3 className={`${cls.text} font-bold mb-3`}>✦ 본문 1~7 스타일</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {BODY_STYLES.map(s => <SelectCard key={s.id} selected={bodyStyle === s.id} onClick={() => setBodyStyle(s.id)}><div className="font-medium">{s.name}</div><p className="text-slate-400 text-xs mt-1">{s.desc}</p></SelectCard>)}
          </div>

          <label className="flex items-center gap-2 mb-4 cursor-pointer"><input type="checkbox" checked={autoVariation} onChange={(e) => setAutoVariation(e.target.checked)} className="w-5 h-5 rounded accent-amber-500" /><span className="text-slate-300">🎲 본문별 구성 자동 변형 (양산 방지)</span></label>

          {bodyStyle === 'custom' && (
            <div className="bg-slate-700/30 rounded-xl p-4 mb-6 space-y-4">
              {Object.entries({ start: '시작 요소', develop: '전개 요소', end: '마무리 요소' }).map(([cat, label]) => (
                <div key={cat}><h4 className="text-slate-300 font-medium mb-2">{label} (최소 1개)</h4><div className="flex flex-wrap gap-2">{BODY_ELEMENTS[cat].map(el => <button key={el.id} onClick={() => setCustomElements(p => ({ ...p, [cat]: p[cat].includes(el.id) ? p[cat].filter(e => e !== el.id) : [...p[cat], el.id] }))} className={`px-3 py-2 rounded-lg text-sm transition-all ${customElements[cat].includes(el.id) ? `${cls.bg} text-slate-900` : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'}`}>{el.label}</button>)}</div></div>
              ))}
            </div>
          )}

          <h3 className={`${cls.text} font-bold mb-3`}>✦ 글자수 (공백제외)</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">{WORD_COUNTS.map(w => <button key={w.value} onClick={() => setWordCount(w.value)} className={`p-3 rounded-xl transition-all ${wordCount === w.value ? `${cls.bg} text-slate-900 font-bold` : 'bg-slate-700/50 border border-slate-600'}`}>{w.label}</button>)}</div>
          <button onClick={genScripts} disabled={selPatterns.length === 0 || loading} className={`w-full ${cls.goldBtn}`}>{loading ? progress || '생성 중...' : '✦ 스크립트 생성'}</button>
        </div>
      )}

      {/* Step 4: 스크립트 */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4">
            <div className={`col-span-3 ${cls.card} p-4`}>
              <div className="flex justify-between items-center mb-4"><span className={`${cls.text} font-bold`}>챕터</span><span className={cls.text}>{totalChars.toLocaleString()}자</span></div>
              {CHAPTERS.map(c => (
                <div key={c.id} className={`p-2 mb-2 rounded-lg flex items-center gap-2 ${selChapter === c.id ? `${cls.selected} border-l-4 ${cls.border}` : 'bg-slate-700/30 hover:bg-slate-700/50'}`}>
                  <input type="checkbox" checked={selectedSections.includes(c.id)} onChange={() => setSelectedSections(p => p.includes(c.id) ? p.filter(s => s !== c.id) : [...p, c.id])} className="w-4 h-4 rounded accent-amber-500 shrink-0" onClick={(e) => e.stopPropagation()} />
                  <div className="flex-1 flex justify-between cursor-pointer" onClick={() => { setSelChapter(c.id); setEditMode(false); }}>
                    <span className="text-sm">{c.id === 'prayer' ? (religion === 'christian' ? '기도문' : '발원문') : c.label}</span>
                    <span className="text-slate-400 text-xs">{getCharCount(scripts[c.id]).toLocaleString()}자</span>
                  </div>
                </div>
              ))}
              <button onClick={() => copy(getFullScript(), 'full')} className={`w-full mt-4 ${cls.outlineBtn}`}>{copied.full ? '✓ 복사완료' : '📋 전체 복사'}</button>
              <button onClick={() => selectedSections.length && setLengthAdjustModal(true)} className={`w-full mt-2 ${cls.outlineBtn} ${!selectedSections.length && 'opacity-50 cursor-not-allowed'}`} disabled={!selectedSections.length}>📏 글자수 조정 {selectedSections.length > 0 && `(${selectedSections.length}개)`}</button>
            </div>
            <div className={`col-span-9 ${cls.card} p-4`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`${cls.text} font-bold`}>{selChapter === 'prayer' ? (religion === 'christian' ? '통합 기도문' : '통합 발원문') : CHAPTERS.find(c => c.id === selChapter)?.label}</h3>
                <div className="flex gap-2">
                  <button onClick={() => copy(scripts[selChapter], 'section')} disabled={regenLoading} className={cls.outlineBtn}>{copied.section ? '✓ 복사완료' : '📋 복사'}</button>
                  <button onClick={() => { setEditMode(!editMode); setEditText(scripts[selChapter]); }} disabled={regenLoading} className={cls.outlineBtn}>{editMode ? '✓ 저장' : '✏️ 직접수정'}</button>
                  <button onClick={() => setRegenModal(true)} disabled={regenLoading} className={cls.outlineBtn}>🔄 재생성</button>
                </div>
              </div>
              {selChapter === 'intro' && !editMode && <div className="flex flex-wrap gap-2 mb-4">{config.quickButtons?.map(b => <button key={b.value} onClick={() => quickRegen(b.value)} disabled={regenLoading} className="bg-slate-700/50 border border-slate-600 px-3 py-1 rounded-full text-sm hover:border-amber-500/50 disabled:opacity-50">{b.label}</button>)}</div>}
              {editMode ? (
                <textarea value={editText} onChange={(e) => setEditText(e.target.value)} onBlur={() => { setScripts(p => ({ ...p, [selChapter]: editText })); setEditMode(false); }} className="w-full h-96 bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white" />
              ) : (
                <div className="h-96 overflow-y-auto bg-slate-700/30 rounded-xl p-4 whitespace-pre-wrap">{regenLoading ? <div className="flex items-center justify-center h-full"><div className={cls.text}>🔄 재생성 중...</div></div> : scripts[selChapter] || '스크립트가 없습니다.'}</div>
              )}
            </div>
          </div>
          <button onClick={() => setStep(5)} className={`w-full ${cls.goldBtn}`}>✦ 다음: 유튜브 설명 & 이미지 설정</button>
        </div>
      )}

      {/* Step 5: 설명/이미지 */}
      {step === 5 && (
        <div className="space-y-6">
          <div className={cls.card + ' p-6'}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`${cls.text} font-bold`}>📝 유튜브 설명</h2>
              <div className="flex gap-2">
                {!ytDesc ? <button onClick={genYtDesc} disabled={ytLoading} className={cls.goldBtn}>{ytLoading ? '생성 중...' : '✦ 생성하기'}</button> : <><button onClick={() => setYtDesc('')} className={cls.outlineBtn}>🔄 재생성</button><button onClick={() => copy(ytDesc, 'yt')} className={cls.outlineBtn}>{copied.yt ? '✓ 복사완료' : '📋 복사'}</button></>}
              </div>
            </div>
            {ytDesc ? <div className="bg-slate-700/30 rounded-xl p-4 whitespace-pre-wrap">{ytDesc}</div> : <p className="text-slate-500 text-center py-8">[생성하기] 버튼을 눌러 유튜브 설명을 생성하세요.</p>}
          </div>

          <div className={cls.card + ' p-6'}>
            <h2 className={`${cls.text} font-bold mb-4`}>🖼️ 이미지 프롬프트 설정</h2>
            <div className="space-y-3 mb-6">
              <SelectCard selected={imgMode === 'auto'} onClick={() => setImgMode('auto')}>◉ 🎨 자동 생성</SelectCard>
              <SelectCard selected={imgMode === 'ref'} onClick={() => setImgMode('ref')}>◉ 🖼️ 참고 이미지 스타일 적용</SelectCard>
            </div>
            {imgMode === 'auto' && (
              <>
                <div className="mb-4"><h3 className="text-slate-300 mb-2">아트 스타일</h3><div className="flex flex-wrap gap-2">{config.artStyles?.map(s => <button key={s.id} onClick={() => setArtStyle(s.id)} className={`px-4 py-2 rounded-full ${artStyle === s.id ? `${cls.bg} text-slate-900` : 'bg-slate-700/50 border border-slate-600'}`}>{s.icon} {s.label}</button>)}</div></div>
                <div className="mb-4"><h3 className="text-slate-300 mb-2">분위기</h3><div className="flex flex-wrap gap-2">{config.moods?.map(m => <button key={m.id} onClick={() => setMood(m.id)} className={`px-4 py-2 rounded-full ${mood === m.id ? `${cls.bg} text-slate-900` : 'bg-slate-700/50 border border-slate-600'}`}>{m.icon} {m.label}</button>)}</div></div>
                <div className="mb-6"><h3 className="text-slate-300 mb-2">피사체 (복수 선택)</h3><div className="flex flex-wrap gap-2">{config.subjects?.map(s => <button key={s.id} onClick={() => setSubjects(p => p.includes(s.id) ? p.filter(x => x !== s.id) : [...p, s.id])} className={`px-4 py-2 rounded-full ${subjects.includes(s.id) ? `${cls.bg} text-slate-900` : 'bg-slate-700/50 border border-slate-600'}`}>{s.icon} {s.label}</button>)}</div></div>
              </>
            )}
            {imgMode === 'ref' && (
              <div className="mb-6">
                <h3 className="text-slate-300 mb-2">참고 이미지 <span className="text-slate-500">{refImgs.length}개</span></h3>
                <div className="flex flex-wrap gap-3 mb-4">
                  {refImgs.map((img, i) => <div key={i} className="relative w-20 h-20"><img src={`data:${img.type};base64,${img.data}`} className="w-full h-full object-cover rounded-lg" /><button onClick={() => setRefImgs(p => p.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-xs">×</button></div>)}
                  <div onClick={() => fileRef.current?.click()} className="w-20 h-20 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-500/50"><span className="text-2xl text-slate-500">+</span></div>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                </div>
                {refImgs.length > 0 && <button onClick={analyzeImages} disabled={imgLoading} className={`w-full bg-slate-700 border ${cls.border}/50 ${cls.text} py-3 rounded-xl mb-4`}>{imgLoading ? '분석 중...' : '🔍 스타일 분석하기'}</button>}
                {analysis && <div className="mb-4"><h4 className={`${cls.text} font-bold mb-2`}>📋 분석 결과</h4><div className="bg-slate-700/30 rounded-xl p-4 max-h-60 overflow-y-auto whitespace-pre-wrap text-sm">{analysis}</div></div>}
              </div>
            )}
            <button onClick={genImgPrompts} disabled={imgLoading || (imgMode === 'ref' && !analysis)} className={`w-full ${cls.goldBtn}`}>{imgLoading ? '생성 중...' : '✦ 이미지 프롬프트 생성'}</button>
            {imgPrompts.length > 0 && (
              <div className="mt-6">
                <div className="flex gap-3 mb-4">
                  <button onClick={() => setImgPrompts([])} className={`flex-1 ${cls.outlineBtn}`}>🔄 이미지 프롬프트 재생성</button>
                  <button onClick={() => copy(imgPrompts.map((p, i) => `#${i + 1}\n${p}`).join('\n\n'), 'allPrompts')} className={`flex-1 ${copied.allPrompts ? 'bg-green-500/20 border-green-500 text-green-400 border' : cls.goldBtn}`}>{copied.allPrompts ? '✓ 전체 복사 완료!' : '📋 전체 복사'}</button>
                </div>
                <div className="grid grid-cols-2 gap-4">{imgPrompts.map((p, i) => <div key={i} className="bg-slate-700/30 rounded-xl p-4"><div className="flex justify-between mb-2"><span className={`${cls.text} font-bold`}>#{i + 1}</span><button onClick={() => copy(p, `img-${i}`)} className={`text-sm ${copied[`img-${i}`] ? 'text-green-400' : 'text-slate-400 hover:text-amber-400'}`}>{copied[`img-${i}`] ? '복사완료 ✓' : '복사'}</button></div><p className="text-sm text-slate-300 line-clamp-3">{p}</p></div>)}</div>
              </div>
            )}
          </div>
          <button onClick={() => setStep(6)} className={`w-full ${cls.goldBtn}`}>✦ 완료</button>
        </div>
      )}

      {/* Step 6: 완료 */}
      {step === 6 && (
        <div className={cls.card + ' p-8 text-center'}>
          <h2 className={`text-2xl ${cls.text} font-bold mb-4`}>{config.icon} 완료!</h2>
          <p className="text-slate-300 mb-6">스크립트 생성이 완료되었습니다.</p>
          <button onClick={resetAll} className={cls.goldBtn}>✦ 처음부터 다시 시작</button>
        </div>
      )}

      {/* Modals */}
      <Modal show={regenModal} onClose={() => { setRegenModal(false); setRegenReq(''); }} title="🔄 재생성 요청">
        <textarea value={regenReq} onChange={(e) => setRegenReq(e.target.value)} placeholder="요청사항을 입력하세요..." className="w-full h-32 bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white mb-4" />
        <div className="flex gap-3">
          <button onClick={() => { setRegenModal(false); setRegenReq(''); }} className={`flex-1 ${cls.outlineBtn}`}>취소</button>
          <button onClick={regenChapter} disabled={!regenReq} className={`flex-1 ${cls.goldBtn}`}>재생성</button>
        </div>
      </Modal>

      <Modal show={showHistory} onClose={() => setShowHistory(false)} title="📚 작업 히스토리">
        {history.length === 0 ? <div className="text-center text-slate-400 py-12">저장된 히스토리가 없습니다.</div> : (
          <div className="max-h-96 overflow-y-auto space-y-3">
            {history.map(entry => (
              <div key={entry.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`${entry.religion === 'buddhist' ? 'text-purple-300' : 'text-amber-300'} font-medium line-clamp-1`}>{entry.religion === 'buddhist' ? '☸️' : '✝️'} {entry.selectedTitle}</p>
                    <p className="text-slate-400 text-sm">{entry.date} · {entry.totalChars?.toLocaleString()}자</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => loadFromHistory(entry)} className={`${isBuddhist ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'} px-3 py-1 rounded-lg text-sm`}>불러오기</button>
                    <button onClick={() => deleteFromHistory(entry.id)} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-sm">삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => setShowHistory(false)} className={`w-full mt-4 ${cls.outlineBtn}`}>닫기</button>
      </Modal>

      <Modal show={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="🔄 처음부터 다시 시작">
        <p className="text-slate-300 mb-6">모든 진행 상황이 초기화됩니다. 계속하시겠습니까?</p>
        <div className="flex gap-3">
          <button onClick={() => setShowResetConfirm(false)} className={`flex-1 ${cls.outlineBtn}`}>취소</button>
          <button onClick={resetAll} className="flex-1 bg-red-500 text-white font-bold py-3 px-6 rounded-xl">초기화</button>
        </div>
      </Modal>

      <Modal show={showTitleRegen} onClose={() => { setShowTitleRegen(false); setTitleRegenOption(''); setTitleRegenText(''); }} title="🔄 제목 다시 생성" loading={loading}>
        <p className="text-slate-300 mb-4">어떤 방향으로 수정할까요?</p>
        <div className="space-y-2 mb-4">{REGEN_OPTIONS.map(opt => <SelectCard key={opt.id} selected={titleRegenOption === opt.id} onClick={() => !loading && setTitleRegenOption(opt.id)} className={loading ? 'opacity-50 cursor-not-allowed' : ''}>{opt.label}</SelectCard>)}</div>
        {(titleRegenOption === 'keyword' || titleRegenOption === 'custom') && <input type="text" value={titleRegenText} onChange={(e) => setTitleRegenText(e.target.value)} placeholder={titleRegenOption === 'keyword' ? '강조할 키워드 입력' : '요청사항 입력'} className="w-full bg-slate-700/50 border border-slate-600 rounded-xl p-4 text-white mb-4" disabled={loading} autoFocus />}
        <div className="flex gap-3">
          <button onClick={() => { setShowTitleRegen(false); setTitleRegenOption(''); setTitleRegenText(''); }} className={`flex-1 ${cls.outlineBtn}`} disabled={loading}>취소</button>
          <button onClick={() => genTitles_fn(titleRegenOption, titleRegenText)} disabled={!titleRegenOption || loading || ((titleRegenOption === 'keyword' || titleRegenOption === 'custom') && !titleRegenText.trim())} className={`flex-1 ${cls.goldBtn}`} style={{ opacity: (!titleRegenOption || loading || ((titleRegenOption === 'keyword' || titleRegenOption === 'custom') && !titleRegenText.trim())) ? 0.5 : 1 }}>{loading ? '⏳ 생성 중...' : '✦ 재생성'}</button>
        </div>
      </Modal>

      <Modal show={lengthAdjustModal} onClose={() => { setLengthAdjustModal(false); setSelectedSections([]); setLengthAdjustRatio(0); }} title="📏 글자수 조정 재작성" loading={lengthAdjustLoading}>
        <div className="mb-4">
          <p className="text-slate-300 mb-2">섹션 선택:</p>
          <div className="grid grid-cols-5 gap-2">{CHAPTERS.map(c => <button key={c.id} onClick={() => setSelectedSections(p => p.includes(c.id) ? p.filter(s => s !== c.id) : [...p, c.id])} className={`p-2 rounded-lg text-xs transition-all ${selectedSections.includes(c.id) ? `${cls.bg} text-slate-900 font-bold` : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}>{c.id === 'intro' ? '도입부' : c.id === 'prayer' ? '기도문' : c.id === 'outro' ? '마무리' : c.label}</button>)}</div>
          <p className="text-slate-500 text-xs mt-2">선택: {selectedSections.length}개</p>
        </div>
        <div className="mb-6">
          <p className="text-slate-300 mb-2">조정 비율:</p>
          <div className="flex gap-2 flex-wrap">{[-30, -20, -10, 10, 20, 30].map(r => <button key={r} onClick={() => setLengthAdjustRatio(r)} className={`px-4 py-2 rounded-lg transition-all ${lengthAdjustRatio === r ? `${cls.bg} text-slate-900 font-bold` : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'}`}>{r > 0 ? `+${r}%` : `${r}%`}</button>)}</div>
          {lengthAdjustRatio !== 0 && <p className="text-slate-400 text-sm mt-2">→ {lengthAdjustRatio > 0 ? '더 길게 (내용 확장)' : '더 짧게 (내용 축약)'}</p>}
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setLengthAdjustModal(false); setSelectedSections([]); setLengthAdjustRatio(0); }} className={`flex-1 ${cls.outlineBtn}`}>취소</button>
          <button onClick={adjustLength} disabled={!selectedSections.length || !lengthAdjustRatio} className={`flex-1 ${cls.goldBtn}`} style={{ opacity: (!selectedSections.length || !lengthAdjustRatio) ? 0.5 : 1 }}>✦ 선택 섹션 재작성</button>
        </div>
      </Modal>
    </div>
  );
}