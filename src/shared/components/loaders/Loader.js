import styled from 'styled-components'
import { keyframes } from 'styled-components'

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
 
    to {
    transform: rotate(360deg);
    }
`

const Loader = styled.div`
    padding: 10px;
    border: 6px solid #4F46E5;
    border-bottom-color: transparent;
    border-radius: 22px;
    animation: ${rotate} 1s infinite linear;
    height: 0;
    width: 0;
    margin:auto;
`

export default Loader;