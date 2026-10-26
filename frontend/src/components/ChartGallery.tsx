import { renderSpecimen } from './SpecimenBody';
import { useState } from 'react';
import { Button } from './ui/button';

const weekly = [['Mon',24],['Tue',48],['Wed',32],['Thu',64],['Fri',80]] as const;
const allocation = [['Reading',60],['Notes',25],['Planning',15]] as const;
const dimensions = [['Clarity',80],['Structure',60],['Spacing',90],['Motion',50],['Contrast',85]] as const;
const variants = ['bar','line','area','donut','radial','radar','compact'] as const;
type ChartType = typeof variants[number];
export function Chart({ type = 'bar' }: { type?: ChartType }) {
  const series = type === 'donut' ? allocation : type === 'radar' ? dimensions : type === 'radial' ? [['Reviewed',72],['Remaining',28]] as const : weekly;
  const points = weekly.map(([,value],index)=>`${24+index*79},${140-value*1.2}`).join(' ');
  const radarPoints = (radius:number,values=dimensions.map(([,value])=>value as number)) => values.map((value,index)=>{const angle=-Math.PI/2+index*Math.PI*2/5;return `${180+Math.cos(angle)*radius*value/100},${100+Math.sin(angle)*radius*value/100}`;}).join(' ');
  return <figure className="stack"><figcaption>{type==='donut'?'Activity allocation · synthetic percent':type==='radial'?'Review completion · synthetic percent':type==='radar'?'Interface dimensions · synthetic score out of 100':'Weekly reading · synthetic minutes'}</figcaption>
    {type==='bar'?<div className="bar-chart" aria-hidden="true">{weekly.map(([day,value])=><div key={day} style={{'--bar-value':value} as React.CSSProperties}><span>{value}</span><i style={{height:`${value}%`}}/><small>{day}</small></div>)}</div>
    :type==='donut'?<div className="donut-row"><div className="donut" aria-hidden="true"><span>60%</span></div><p>Reading 60%<br/>Notes 25%<br/>Planning 15%</p></div>
    :type==='radial'?<div className="radial-chart"><svg viewBox="0 0 200 200" role="img" aria-label="72 percent reviewed"><circle cx="100" cy="100" r="72" fill="none" stroke="var(--panel-border)" strokeWidth="16"/><circle cx="100" cy="100" r="72" fill="none" stroke="var(--chart-1)" strokeWidth="16" pathLength="100" strokeDasharray="72 100" transform="rotate(-90 100 100)"/><text x="100" y="104" textAnchor="middle" fill="var(--foreground)">72%</text></svg></div>
    :type==='radar'?<svg className="radar-chart" viewBox="0 0 360 220" role="img" aria-label="Five synthetic interface dimension scores on a zero to 100 scale">{[25,50,75,100].map(radius=><polygon key={radius} points={radarPoints(radius*.7,[100,100,100,100,100])} fill="none" stroke="var(--panel-border)"/>)}<polygon points={radarPoints(70)} fill="var(--chart-1)" fillOpacity=".15" stroke="var(--chart-1)" strokeWidth="2"/>{dimensions.map(([label],index)=>{const angle=-Math.PI/2+index*Math.PI*2/5;return <text key={label} x={180+Math.cos(angle)*97} y={104+Math.sin(angle)*97} textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">{label}</text>;})}</svg>
    :<svg className={type==='compact'?'line-chart compact-chart':'line-chart'} viewBox="0 0 360 160" role="img" aria-label="Reading rises from 24 minutes on Monday to 80 on Friday">{type!=='compact'&&<path className="chart-grid" d="M24 20H340M24 80H340M24 140H340M24 20V140"/>}{type==='area'&&<polygon points={`24,140 ${points} 340,140`} fill="var(--chart-1)" fillOpacity=".15"/>}<polyline points={points} fill="none" stroke="var(--chart-1)" strokeWidth="3"/>{weekly.map(([,value],index)=><circle key={index} cx={24+index*79} cy={140-value*1.2} r="4" fill="var(--foreground)"/>)}<text x="24" y="156">Mon</text><text x="312" y="156">Fri</text></svg>}
    <details><summary>View exact data</summary><table className="data-alternative"><caption>{type==='donut'||type==='radial'?'Allocation · percent':type==='radar'?'Dimension · score out of 100':'Reading time · minutes'}</caption><thead><tr><th scope="col">{type==='donut'||type==='radial'?'Activity':type==='radar'?'Dimension':'Day'}</th><th scope="col">Value</th></tr></thead><tbody>{series.map(([label,value])=><tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody></table></details>
  </figure>;
}
export default function ChartGallery() { const [type,setType]=useState<ChartType>('bar');return <div className="stack"><div className="cluster" role="group" aria-label="Chart variant">{variants.map(value=><Button key={value} variant="outline" aria-pressed={type===value} onClick={()=>setType(value)}>{value}</Button>)}</div><Chart type={type}/></div>; }

export const chartRenderers = {
  'chart': ChartGallery,
};
export function ChartSpecimen({ slug }: { slug: string }) { return renderSpecimen(slug, chartRenderers); }
