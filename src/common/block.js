import styled from 'styled-components'

const Block = styled.div`
display: flex;
flex-direction: ${p => p.column ? 'column' : 'row'};
padding: '10px';
${p => p.justifyContentCenter && `justify-content: center;`}
${p => p.alignItemsCenter && `align-items: center;`}
${p => p.fullFlex && `
  flex: 1;
`}
${p => p.withWrap && 'flex-wrap: wrap;'}
`

export default Block