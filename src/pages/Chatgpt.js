import React, { useEffect } from 'react'
import sendIcon from '../assets/send.png'
import { Helmet } from "react-helmet";
import bot from '../assets/ChatGPT-Icon.png'
import user from '../assets/user.png'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import SendIcon from '@mui/icons-material/Send';
import CarData from '../data/car-data.json'
import { Compare } from '@mui/icons-material';
import env from 'react-dotenv';

const { Configuration, OpenAIApi } = require("openai");

function Chatgpt() {

     const apiConfig = {
        name: {
            title: "Chat",
            desc: "Open ended conversation with an AI assistant.",
            color: "#7941DD"
        },
        props: {
            model: "text-davinci-003",
            temperature: 0.9,
            max_tokens: 500,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        }
    }

    const configuration = new Configuration({
       apiKey: process.env.REACT_APP_OPENAI_API_KEY, //  <----- put your API key here   //    visit and register at  (https://beta.openai.com/account/api-keys) for Api keys
      });

    const openai = new OpenAIApi(configuration);

    const carData = CarData

    let conversationHistory = ''
    let compareCarMode = false
    const CAR_INITIAL_PROMPT = "can you compare 2022 BMW 5 Series Sedan against Audi A6?"

    useEffect(() => {
        let loadInterval

        const form = document.querySelector('form')
        const button = document.querySelector('button')
        const chatContainer = document.querySelector('#chat_container')

        function loader(element) {
            element.textContent = ''

            loadInterval = setInterval(() => {
                // Update the text content of the loading indicator
                element.textContent += '.';

                // If the loading indicator has reached three dots, reset it
                if (element.textContent === '....') {
                    element.textContent = '';
                }
            }, 300);
        }

        //robot TYPING animation
        function typeText(element, text) {
            let index = 0

            let interval = setInterval(() => {
                if (index < text.length) {
                    element.innerHTML += text.charAt(index)
                    index++
                } else {
                    clearInterval(interval)
                }
            }, 20)
        }

        //Generating random id number
        function generateUniqueId() {
            const timestamp = Date.now();
            const randomNumber = Math.random();
            const hexadecimalString = randomNumber.toString(16);

            return `id-${timestamp}-${hexadecimalString}`;
        }

        //Used to swap the AI and User section
        function chatStripe(isAi, value, uniqueId) {
            return (
                `
                <div class="wrapper ${isAi && 'ai'}">
                    <div class="chat">
                        <div class="profile">
                            <img 
                              src=${isAi ? bot : user} 
                              alt="${isAi ? 'bot' : 'user'}" 
                            />
                        </div>
                        <div class="message" id=${uniqueId}>${value}</div>
                    </div>
                </div>
            `
            )
        }

        const compareSubmit = async () => {

            compareCarMode = true

            handleSubmit()

        }

        const handleSubmit = async (e) => {
            //e.preventDefault()

            const data = new FormData(form)

            //for user type or question
            chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

            form.reset()

            //for bot or AI typing
            const uniqueId = generateUniqueId()
            chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

            //scroll-up when the answer is at the very bottom
            chatContainer.scrollTop = chatContainer.scrollHeight;

            //getting each AI answer by ID then pass to loader function to display
            const messageDiv = document.getElementById(uniqueId)

            loader(messageDiv)

            let promptData = ''

            if (compareCarMode) {
                promptData = CAR_INITIAL_PROMPT
                compareCarMode = false
            }
            else {
                promptData = data.get('prompt')
            }

            //conversationHistory = conversationHistory + USERNAME + ':' + data.get('prompt') + '\n'
            conversationHistory = conversationHistory + promptData
            //conversation_history += f"{USERNAME}: {input_str}\n"

            console.log(conversationHistory)

            let newObj = {
                name: { ...apiConfig.name },
                props: { ...apiConfig.props, prompt: conversationHistory },
              };

            try {

                console.log(configuration.apiKey)
                const response = await openai.createCompletion(newObj.props)

                clearInterval(loadInterval)
                messageDiv.innerHTML = " "

                if (response.status===429) {
                    messageDiv.innerHTML = "You achieved your rate limit, please try again later"
                    return
                }

                //if (response.ok) {
                if (response.data.choices[0].text && response.status===200) {
                    //const data = await response.json();
                    //const parsedData = data.bot.trim()
                    const parsedData = response.data.choices[0].text

                    //conversation_history += f"{AI_NAME}: {message}\n"
                    //conversationHistory = conversationHistory + AI_NAME + ':' + parsedData + '\n'
                    conversationHistory = conversationHistory + parsedData

                    typeText(messageDiv, parsedData)
                } else {
                    //const err = await response.text()

                    messageDiv.innerHTML = "Something went wrong, please try again"
                    // alert(err);
                }
            }
            catch(e) {
                if (e.message.includes("429")) {
                    messageDiv.innerHTML = "You achieved your chatGPT rate limit, please try again later"
                }
                else {
                    messageDiv.innerHTML = "Something went wrong, please try again: " + e.message 
                }
            }

            
        }

        button.addEventListener('click', compareSubmit);

        form.addEventListener('submit', handleSubmit);

        form.addEventListener('keyup', (e) => {
            if (e.keyCode === 13) {
                handleSubmit(e)
            }
        })

    }, [])



    return (
        <div>
            <div id="app">
                    <Stack direction="row" spacing={2} padding="20px">
                    <Card >
                            <CardMedia
                            component="img"
                            height="200"
                            image={carData.popularComparisons[0].imageUrl1}
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {carData.popularComparisons[0].name1}
                            </Typography>
                            <Typography gutterBottom component="div">
                                {carData.popularComparisons[0].variant1}
                            </Typography>
                         
                            </CardContent>
                            <CardActions>
                        {/*  <a href={`https://www.youtube.com/watch?v=${id.videoId}`}>Watch</a> */}
                            {/* <Button size="small">Share</Button> */}
                            {/* <Button size="medium"  >Learn More</Button> */}
                            </CardActions>
                        </Card>
                        <span> X </span>

                        <Card >
                            <CardMedia
                            component="img"
                            height="200"
                            image={CarData.popularComparisons[1].imageUrl1}
                            />
                            <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {CarData.popularComparisons[1].name1}
                            </Typography>
                            <Typography gutterBottom component="div">
                                {CarData.popularComparisons[1].variant1}
                            </Typography>
                         
                            </CardContent>
                            <CardActions>
                        {/*  <a href={`https://www.youtube.com/watch?v=${id.videoId}`}>Watch</a> */}
                            {/* <Button size="small">Share</Button> */}
                            {/* <Button size="medium"  >Learn More</Button> */}
                            </CardActions>
                        </Card>
                        
                    </Stack>
                        
                   {/*      <Button size="medium" variant="contained" endIcon={<SendIcon />} onClick={compareSubmit} >Compare</Button> */}
                        <button className='button' endIcon={<SendIcon />}>Compare</button>
                        <div id="chat_container"></div>
                        <span className="text-headline" >Improve your comparison by asking me about performance, fuel economy, transmission, infotainment, etc.:</span>
                        <form>
                            <textarea name="prompt" rows="1" cols="1" placeholder="Write your question here..."></textarea>
                            <button id='btn' type="submit"><img src={sendIcon} alt="send" /> </button>
                        </form>
            </div>
            <script src="./script.js" async></script>
        </div>
    )
}

export default Chatgpt