"use client";

import { useEffect, useMemo, useState } from "react";

type Problem = { id:number; title:string; slug:string; role:string; pattern:string; minutes:number; why:string; signal:string; hints:string[] };
type Lesson = { day:number; label:string; focus:string; problems:Problem[] };
type TrainingLog = { date:string; day:number; outcome:string; complexity:string; reflection:string; hintCount:number };
type GymState = { day:number; completed:string[]; hints:Record<string,number>; reflection:string; complexity:string; outcome:string; checkins:string[]; logs:TrainingLog[] };

const p = (id:number,title:string,slug:string,role:string,pattern:string,minutes:number,why:string,signal:string,hints:string[]):Problem => ({id,title,slug,role,pattern,minutes,why,signal,hints});
const lessons:Lesson[] = [
  {day:1,label:"Hash 起点",focus:"用空间换时间：把重复扫描变成常数级查找",problems:[
    p(217,"Contains Duplicate","contains-duplicate","核心题","HashSet",20,"最干净的 Set 入门。先看见『是否存在』，再想到记录见过的元素。","duplicate / seen before / unique → Set",["暴力法中，哪一步被重复做了？","维护一个集合，表示此前见过的所有数。","若当前数已在集合中就返回 true，否则加入集合。"]),
    p(1,"Two Sum","two-sum","迁移题","HashMap",25,"从『见过吗』升级到『我还缺谁』，建立一遍扫描的补数思维。","pair + target → 查 complement",["固定 x，另一个数必须是多少？","Map 保存 value → index；先查 target-x。","先查后存，避免同一位置使用两次。"])]},
  {day:2,label:"频率统计",focus:"从存在性迁移到计数",problems:[
    p(242,"Valid Anagram","valid-anagram","核心题","Counting",25,"学习频率表，并比较 int[26] 与 HashMap 的边界。","重排后相同 → 比较频率",["顺序不重要时，什么信息仍必须相同？","一个字符串加计数，另一个减计数。","长度先判不同；最后所有净计数为 0。"]),
    p(1,"Two Sum","two-sum","闭卷复习","HashMap recall",15,"24 小时后重做，验证记住的是不变量而非代码。","先口述 Map 在循环中的含义",["写出暴力法复杂度。","当前需要的补数是 target-nums[i]。","先查后放。"])]},
  {day:3,label:"Canonical Key",focus:"为对象构造稳定表示",problems:[
    p(49,"Group Anagrams","group-anagrams","核心题","HashMap grouping",35,"把频率统计升级成分组键，是数据处理的高迁移模式。","等价对象分组 → canonical key",["异位词共享什么稳定特征？","排序字符串或 26 位频率向量可作为 key。","Map<key,List<String>>，逐词追加。"]),
    p(242,"Valid Anagram","valid-anagram","闭卷复习","Counting recall",12,"把判断逻辑讲清楚，为分组键做准备。","频率相等是充分必要条件",["先检查长度。","记录净频率。","检查所有计数为 0。"])]},
  {day:4,label:"Prefix Sum",focus:"把重复求和变成累计状态",problems:[
    p(1480,"Running Sum","running-sum-of-1d-array","核心题","Prefix Sum",15,"建立前缀和的定义。","到当前位置 / 区间总和 → prefix",["当前答案与前一位置有什么关系？","prefix[i]=prefix[i-1]+nums[i]。","可以从 i=1 原地累加。"]),
    p(724,"Find Pivot Index","find-pivot-index","迁移题","Prefix invariant",25,"不建额外数组也能维护左侧和。","左右平衡 → total-left-current",["当前位置右和如何表达？","right=total-left-nums[i]。","先比较，再把当前值加入 left。"])]},
  {day:5,label:"One-pass State",focus:"扫描中维护历史最优信息",problems:[
    p(121,"Best Time to Buy and Sell Stock","best-time-to-buy-and-sell-stock","核心题","Running minimum",30,"理解局部状态如何产生全局最优。","一次买卖且有先后 → 历史最低",["卖在今天时，最好买入价是什么？","维护 minPrice 与 bestProfit。","用 price-minPrice 更新答案。"]),
    p(724,"Find Pivot Index","find-pivot-index","闭卷复习","Prefix recall",15,"强化 total、left、current 的不变量。","循环开始时 left 不含当前元素",["先求 total。","推导 right。","注意更新顺序。"])]},
  {day:6,label:"Kadane",focus:"局部状态与全局答案",problems:[
    p(53,"Maximum Subarray","maximum-subarray","核心题","Kadane / DP",35,"连接贪心、动态规划与状态压缩。","连续子数组最优 → 以 i 结尾",["定义『必须以 i 结尾』的最大和。","要么重新开始，要么接在此前后面。","current=max(x,current+x)，同时更新 best。"]),
    p(121,"Best Time to Buy and Sell Stock","best-time-to-buy-and-sell-stock","闭卷复习","State recall",15,"对比 min-so-far 与 best-so-far。","解释买入为何一定来自今天以前",["维护历史最低。","算今天卖出的收益。","更新全局答案。"])]},
  {day:7,label:"Weekly Recall",focus:"不看标签、不看旧代码，验证真正掌握",problems:[
    p(1,"Two Sum","two-sum","闭卷复习","HashMap",12,"第一周核心模式测试。","暴力瓶颈 → complement invariant",["pair + target。","查补数。","先查后存。"]),
    p(724,"Find Pivot Index","find-pivot-index","闭卷复习","Prefix Sum",15,"从公式而非代码记忆推导。","total=left+current+right",["先总和。","推导右和。","维护左和。"])]},
  {day:8,label:"Two Pointers",focus:"利用两端结构缩小搜索范围",problems:[
    p(125,"Valid Palindrome","valid-palindrome","核心题","Opposite pointers",25,"最直观的左右指针模型。","回文 / 对称 → 两端比较",["哪些字符应跳过？","两边跳过非字母数字，再比较小写。","不等立即 false，相等后收缩。"]),
    p(344,"Reverse String","reverse-string","迁移题","In-place pointers",15,"练习原地交换与 O(1) 空间。","原地反转 → 两端交换",["第一位最终来自哪里？","交换 left 与 right。","两边向中间移动。"])]},
  {day:9,label:"Write Pointer",focus:"维护已处理前缀",problems:[
    p(283,"Move Zeroes","move-zeroes","核心题","Fast / slow",25,"slow 是『下一次写入位置』。","原地过滤且保持顺序 → write pointer",["先把非零数写到前面。","write 指向下一写入位置。","剩余位置填 0。"]),
    p(26,"Remove Duplicates","remove-duplicates-from-sorted-array","迁移题","Write pointer",25,"把相同模板迁移到有序数组去重。","有序 + 原地压缩",["什么时候才写入？","与最后一个已写入元素不同才写。","write 从 1 开始。"])]},
  {day:10,label:"Sorted Pointers",focus:"有序性让决策可证明",problems:[
    p(977,"Squares of a Sorted Array","squares-of-a-sorted-array","核心题","Two ends",25,"最大平方一定来自两端。","有序数组的边界极值",["最大平方来自哪里？","比较两端绝对值。","从结果末尾向前填。"]),
    p(167,"Two Sum II","two-sum-ii-input-array-is-sorted","迁移题","Converging pointers",20,"与 HashMap 方案比较时空权衡。","有序 + 两数目标",["和太小时移动哪边？","小则 left++，大则 right--。","返回 1-indexed 位置。"])]},
  {day:11,label:"Proof Day",focus:"会写，还要证明为什么这样移动",problems:[
    p(11,"Container With Most Water","container-with-most-water","核心题","Greedy pointers",35,"经典追问：为什么一定移动短板？","面积受短板限制",["面积由哪根高度限制？","移动长板不能消除短板限制。","记录面积后移动较短边。"]),
    p(167,"Two Sum II","two-sum-ii-input-array-is-sorted","闭卷复习","Pointer proof",15,"用单调性解释不会错过答案。","每次排除一类不可能组合",["和太小。","只有增大较小端才可能命中。","反之移动右端。"])]},
  {day:12,label:"Sliding Window",focus:"固定窗口与可变窗口的共同不变量",problems:[
    p(643,"Maximum Average Subarray I","maximum-average-subarray-i","核心题","Fixed window",25,"用增一减一替代重复求和。","连续且长度固定为 k",["相邻窗口共享什么？","减离开的，加新进入的。","先算首窗，再滚动更新。"]),
    p(209,"Minimum Size Subarray Sum","minimum-size-subarray-sum","迁移题","Variable window",30,"维护『合法时尽量收缩』。","正数 + 连续区间 + 至少阈值",["何时可以尝试缩短？","sum>=target 时反复移动 left。","每次收缩前更新答案。"])]},
  {day:13,label:"Window Legality",focus:"窗口不合法时移动左边界",problems:[
    p(3,"Longest Substring Without Repeating","longest-substring-without-repeating-characters","核心题","Window + Set",35,"HashSet 与滑动窗口第一次组合。","最长连续片段 + 内部约束",["窗口何时不合法？","重复时从左删除直到合法。","合法后更新长度；left 不后退。"]),
    p(209,"Minimum Size Subarray Sum","minimum-size-subarray-sum","闭卷复习","Window recall",18,"对比两种窗口的收缩时机。","先说清 invariant 再写代码",["扩大 right。","合法时反复收缩。","收缩前更新最短长度。"])]},
  {day:14,label:"First Medium Combo",focus:"排序 + 双指针 + 去重",problems:[
    p(15,"3Sum","3sum","核心题","Sort + two pointers",45,"前两周组合题；第一次允许引导完成。","三数目标 → 固定一个 + Two Sum II",["固定一个数后，剩下变成什么？","排序；用 left/right 搜索 -nums[i]。","i、left、right 都要跳过重复。"]),
    p(3,"Longest Substring Without Repeating","longest-substring-without-repeating-characters","闭卷复习","Window recall",22,"验证窗口合法性与左指针不后退。","讲清 Set 版与 last-index Map 版",["维护无重复窗口。","重复则移动 left。","每字符最多进出一次，所以 O(n)。"])]},
];

const blank:GymState = {day:1,completed:[],hints:{},reflection:"",complexity:"",outcome:"",checkins:[],logs:[]};
const laDate = (d=new Date()) => new Intl.DateTimeFormat("en-CA",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);
const keyFor = (day:number,id:number) => `${day}-${id}`;

export default function AlgorithmGym(){
  const [state,setState]=useState<GymState>(blank); const [loaded,setLoaded]=useState(false);
  const [copied,setCopied]=useState(false);
  const lesson=lessons[state.day-1];
  useEffect(()=>{const timer=setTimeout(()=>{try{const s=localStorage.getItem("shiyue-algo-gym-v1");if(s)setState({...blank,...JSON.parse(s)})}catch{}setLoaded(true)},0);return()=>clearTimeout(timer)},[]);
  useEffect(()=>{if(loaded)localStorage.setItem("shiyue-algo-gym-v1",JSON.stringify(state))},[state,loaded]);
  const allDone=lesson.problems.every(x=>state.completed.includes(keyFor(state.day,x.id)));
  const checked=state.checkins.includes(laDate());
  const streak=useMemo(()=>{const set=new Set(state.checkins);let n=0;const c=new Date();for(let i=0;i<365;i++){if(!set.has(laDate(c)))break;n++;c.setDate(c.getDate()-1)}return n},[state.checkins]);
  const changeDay=(day:number)=>setState(s=>({...s,day,reflection:"",complexity:"",outcome:""}));
  const toggle=(id:number)=>setState(s=>{const k=keyFor(s.day,id);return{...s,completed:s.completed.includes(k)?s.completed.filter(x=>x!==k):[...s.completed,k]}});
  const hint=(id:number)=>setState(s=>{const k=keyFor(s.day,id);return{...s,hints:{...s.hints,[k]:Math.min(3,(s.hints[k]||0)+1)}}});
  const ready=allDone&&!!state.reflection.trim()&&!!state.complexity.trim()&&!!state.outcome;
  const checkin=()=>{if(ready)setState(s=>{const date=laDate(),log:TrainingLog={date,day:s.day,outcome:s.outcome,complexity:s.complexity,reflection:s.reflection,hintCount:lesson.problems.reduce((sum,x)=>sum+(s.hints[keyFor(s.day,x.id)]||0),0)};return{...s,checkins:[...new Set([...s.checkins,date])],logs:[...s.logs.filter(x=>!(x.date===date&&x.day===s.day)),log]}})};
  const copyCoachSnapshot=async()=>{const recent=state.logs.slice(-7);const snapshot=["SHIYUE ALGORITHM GYM — COACH SNAPSHOT",`Current day: ${state.day}/14 (${lesson.label})`,`Streak: ${streak}`,`Completed slots: ${state.completed.length}`,"Recent training logs:",...(recent.length?recent.map(x=>`- ${x.date} Day ${x.day}: ${x.outcome}; hints=${x.hintCount}; ${x.complexity}; reflection=${x.reflection}`):["- No completed check-ins yet."]),"Coach rules: Java 21 primary; review before new problems; use progressive hints; do not create problem debt."].join("\n");await navigator.clipboard.writeText(snapshot);setCopied(true);setTimeout(()=>setCopied(false),1800)};
  const completion=Math.round(((state.day-1+(allDone?1:0))/14)*100);

  return <main className="app-shell">
    <header className="topbar"><a className="brand" href="#top"><span className="brand-mark">S</span><span>Algorithm Gym</span></a><nav><a href="#today">今日训练</a><a href="#roadmap">路线</a><a href="#review">复盘</a></nav><div className="streak-pill">🔥 <strong>{streak}</strong> day streak</div></header>
    <section id="top" className="hero"><div className="hero-copy"><p className="eyebrow">SHIYUE&apos;S PRIVATE TRAINING SYSTEM · JAVA 21</p><h1>不是刷题。<br/><em>是训练识别模式。</em></h1><p className="hero-note">每天一个可迁移的核心模式，一道变式或复习。目标不是背答案，而是能在面试里从暴力解推导出不变量。</p><div className="hero-actions"><a className="primary-button" href="#today">开始 Day {state.day} <span>→</span></a><span className="time-note">约 {lesson.problems.reduce((a,x)=>a+x.minutes,0)} 分钟 · 允许最低可行日</span></div></div><aside className="quote-card"><span className="quote-open">“</span><p>Make it work.<br/>Make it clear.<br/><strong>Then make it fast.</strong></p><span className="quote-by">TODAY&apos;S INTERVIEW MINDSET</span></aside></section>
    <section className="stats-strip"><div><span>当前阶段</span><strong>FOUNDATIONS</strong></div><div><span>课程进度</span><strong>{completion}%</strong><div className="mini-track"><i style={{width:`${completion}%`}}/></div></div><div><span>今日主题</span><strong>{lesson.label}</strong></div><div><span>主语言</span><strong>JAVA 21</strong></div></section>
    <section id="today" className="today-section"><div className="section-heading"><div><p className="eyebrow dark">DAY {String(state.day).padStart(2,"0")} · {lesson.label}</p><h2>今日训练</h2></div><p>{lesson.focus}</p></div><div className="problem-grid">{lesson.problems.map((x,i)=>{const k=keyFor(state.day,x.id),done=state.completed.includes(k),level=state.hints[k]||0;return <article className={`problem-card ${done?"done":""}`} key={k}><div className="problem-top"><span className="problem-index">0{i+1}</span><span className="role-chip">{x.role}</span><span className="minutes">{x.minutes} MIN</span></div><p className="pattern">{x.pattern}</p><h3>{x.title}</h3><p className="why">{x.why}</p><div className="signal"><span>面试识别信号</span><p>{x.signal}</p></div>{level>0&&<div className="hints">{x.hints.slice(0,level).map((h,n)=><p key={h}><b>Hint {n+1}</b>{h}</p>)}</div>}<div className="problem-actions"><a href={`https://leetcode.com/problems/${x.slug}/`} target="_blank" rel="noreferrer">打开 LeetCode ↗</a><button onClick={()=>hint(x.id)} disabled={level===3}>{level===0?"解锁提示":level===3?"提示已全部解锁":`再看一层提示 (${level}/3)`}</button></div><label className="complete-check"><input type="checkbox" checked={done} onChange={()=>toggle(x.id)}/><span>{done?"已完成 · 去讲清楚它":"完成编码与手动测试"}</span></label></article>})}</div></section>
    <section id="review" className="review-section"><div className="review-copy"><p className="eyebrow">THE 3-MINUTE DEBRIEF</p><h2>代码通过，不等于掌握。</h2><p>面试官真正关心你是否理解数据结构、循环不变量和边界。用自己的话留下证据，系统才允许完成打卡。</p><ol><li><span>1</span>我看到什么信号识别出模式？</li><li><span>2</span>暴力解法的重复工作在哪？</li><li><span>3</span>优化解法始终维护什么事实？</li></ol></div><div className="review-form"><fieldset><legend>今天的完成方式</legend><div className="outcome-row">{[["independent","独立完成"],["hinted","提示后完成"],["studied","看答案学会"]].map(([v,l])=><label key={v}><input type="radio" name="outcome" checked={state.outcome===v} onChange={()=>setState(s=>({...s,outcome:v}))}/><span>{l}</span></label>)}</div></fieldset><label>时间与空间复杂度<input value={state.complexity} onChange={e=>setState(s=>({...s,complexity:e.target.value}))} placeholder="Time O(n), Space O(n)；为什么？"/></label><label>一句真正的复盘<textarea value={state.reflection} onChange={e=>setState(s=>({...s,reflection:e.target.value}))} placeholder="我原本卡在……不变量是……下次看到……我会想到……" rows={4}/></label><button className="checkin-button" onClick={checkin} disabled={checked}>{checked?"✓ 今日打卡完成":"完成今日打卡"}<span>{ready?"READY":`${[allDone,!!state.reflection.trim(),!!state.complexity.trim(),!!state.outcome].filter(Boolean).length}/4`}</span></button>{!checked&&<p className="requirement">需要：两题完成 · 完成方式 · 复杂度 · 复盘</p>}</div></section>
    <section id="roadmap" className="roadmap-section"><div className="section-heading"><div><p className="eyebrow dark">14-DAY FOUNDATION SPRINT</p><h2>路线不是题目清单，<br/>而是能力依赖图。</h2></div><p>Hash → 累计状态 → 双指针 → 滑动窗口。Day 14 用 3Sum 把前两周连接起来。</p></div><div className="days-grid">{lessons.map(x=><button key={x.day} onClick={()=>changeDay(x.day)} className={x.day===state.day?"active":x.day<state.day?"past":""}><span>D{String(x.day).padStart(2,"0")}</span><strong>{x.label}</strong><small>{x.problems.map(y=>y.pattern).join(" · ")}</small></button>)}</div><div className="language-plan"><div><span className="java-dot"/><p><strong>Java 21 主线</strong><br/>每道新题先用 Java，训练集合、类型、边界与可读性。</p></div><div><span className="python-dot"/><p><strong>Python 迁移</strong><br/>每周二、周六挑一题 10–15 分钟重写，服务 AI / ML / Data。</p></div><div><span className="rest-dot"/><p><strong>不制造题债</strong><br/>漏一天不补四题；复习优先，每天最多两个槽位。</p></div></div><div className="coach-export"><div><p className="eyebrow dark">PORTABLE MEMORY</p><h3>让教练记住你真正卡在哪里。</h3><p>复制最近训练快照，换聊天时直接贴给我；提示依赖、复杂度与复盘都会一起带走。</p></div><button onClick={copyCoachSnapshot}>{copied?"✓ 已复制教练快照":"复制教练快照"}</button></div></section>
    <footer><div className="brand"><span className="brand-mark">S</span><span>Algorithm Gym</span></div><p>Personal algorithm training · Java 21 · Pattern-first practice</p><button onClick={()=>{if(confirm("确定清空本机进度吗？")){localStorage.removeItem("shiyue-algo-gym-v1");setState(blank)}}}>重置本地进度</button></footer>
  </main>
}
