from dotenv import load_dotenv
import pandas as pd
import json
import yaml
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

from langchain.prompts import ChatPromptTemplate
from langchain.prompts import PromptTemplate
from langchain.prompts.chat import (
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    SystemMessagePromptTemplate,
)

import os
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.chains import ConversationChain
from langchain_aws import BedrockLLM

class UtilProcessor:

    def __init__(self, project_root):
        
        self.project_root = project_root
        self.logger = None
        
        load_dotenv()

        # llm = ChatOpenAI(temperature=self.llm_temperature, model=self.llm_model)
        # llm = ChatOpenAI(temperature=0.0, model=self.llm_model, top_p=1.0, frequency_penalty=0.0, presence_penalty=0.0)
        
        # groq_api_key="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"
        # groq_api_key="gsk_bnxkOb5Dp02WA1BUQuuCWGdyb3FYp4ubTeSTdfJiJgkIV9HQMMka"
        groq_api_key = os.getenv('GROQ_API_KEY')
        # self.llm = ChatGroq(groq_api_key=groq_api_key,temperature=0, model_name="llama-3.2-90b-text-preview")

        # groq_llama_model_name = 'llama-3.1-8b-instant'
        # groq_llama_model_name =  "llama-3.2-90b-text-preview"
        # self.llm = ChatGroq(groq_api_key=groq_api_key,temperature=0, model_name=groq_llama_model_name)
           
        # model_size = 90
        # together_api_key = os.getenv('TOGETHER_API_KEY')
        # model = f"meta-llama/Llama-3.2-{model_size}B-Vision-Instruct-Turbo"
        # self.t_llm = Together(
        #     model=model,
        #     together_api_key=os.getenv('TOGETHER_API_KEY')
        # )

        model_id = "us.meta.llama3-2-90b-instruct-v1:0"
        self.llm = BedrockLLM(
            credentials_profile_name="pocs",
            model_id=model_id,
            region_name="us-east-1",
            max_tokens = 2048
        )


    def get_llm_response(self,prompt,input, history):
        chat_prompt = ChatPromptTemplate.from_template(prompt)
        # Combine history and question into a single context
        context = "\n".join(history) + f"\nUser: {input}"
        
        # Get response from the LLM
        runnable = chat_prompt | self.llm | StrOutputParser()

        inputs = {
            "input": context
        }

        print(context)

        response = runnable.invoke(inputs)

        # print(response)
        
        # Extract the response text
        return response.strip()

    def t_get_llm_response(self,prompt,input, history):
        # chat_prompt = ChatPromptTemplate.from_template(prompt)
        # Combine history and question into a single context
        context = "\n".join(history) + f"\nUser: {input}"
        chat_prompt = f"<|start_header_id|>system<|end_header_id|>\n{prompt}\n<|eot_id|><|start_header_id|>user<|end_header_id|>\n{context}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"
        response = self.t_llm.invoke(chat_prompt)
        return response.strip() if response else "No response received"
        
        # # Get response from the LLM
        # runnable = chat_prompt | self.llm | StrOutputParser()

        # inputs = {
        #     "input": context
        # }

        # print(context)

        # response = runnable.invoke(inputs)

        # # print(response)
        
        # # Extract the response text
        # return response.strip()
    
    def aws_get_llm_response(self,prompt,input, history):
        # chat_prompt = ChatPromptTemplate.from_template(prompt)
        # Combine history and question into a single context
        context = "\n".join(history) + f"\nUser: {input}"
        # chat_prompt = f"<|start_header_id|>system<|end_header_id|>\n{prompt}\n<|eot_id|><|start_header_id|>user<|end_header_id|>\n{context}<|eot_id|><|start_header_id|>assistant<|end_header_id|>"
        # chat_prompt = f"<|start_header_id|>system<|end_header_id|>\n{prompt}\n<|eot_id|>
        # <|start_header_id|>user<|end_header_id>\n{context}<|eot_id|><|start_header_id|>assistant<|end_header_id>"

        chat_prompt = f"""<|start_header_id|>system<|end_header_id|>
        \n{prompt}\n
        <|eot_id|><|start_header_id|>user<|end_header_id|>

        {context}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
            """

        response = self.llm.invoke(chat_prompt)
        return response.strip() if response else "No response received"
    
    def get_llm_response_old(self,system_context,user_message):
        # llm = ChatOpenAI(temperature=self.llm_temperature, model=self.llm_model)
        # llm = ChatOpenAI(temperature=0.0, model=self.llm_model, top_p=1.0, frequency_penalty=0.0, presence_penalty=0.0)
        
        # groq_api_key="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"
        groq_api_key="gsk_bnxkOb5Dp02WA1BUQuuCWGdyb3FYp4ubTeSTdfJiJgkIV9HQMMka"
        llm = ChatGroq(groq_api_key=groq_api_key,temperature=0, model_name="llama-3.2-90b-text-preview")
        messages = [
        SystemMessagePromptTemplate.from_template("{system_message}"),
        HumanMessagePromptTemplate.from_template("{user_message}"),
            ]
        chat_prompt = ChatPromptTemplate.from_messages(messages)

        chain = chat_prompt | llm
        system_message = system_context
        print(f"system_message  => {system_message}")
        print(f"user_message  => {user_message}")
        response = chain.invoke({"system_message":system_message,"user_message":user_message})

        result = response.content

        print(f"LLM result  => {result}")

        return result

    def llm_response(self, system_message,user_message):

        system_context = system_message
        user_message = user_message
                
        response = self.get_llm_response(system_context,user_message)

        return response
    

    def initialize_help_chain(self, course: str, topic: str):

        template = f"""
        You are a School Teacher and an expert in {course} course.
        I need your assistance to learn {course} course, you need to teach me step by step.
        Do not give me all things at once.
        Explain a bit information on topic like explaining to 2nd grade kid in mores examples.
        and then ask me subjective answer question with simple kids objects example so that i can understand the concept.
        After my answer, correct me and explain more and next information of the topic.\n\n
        Each inforamtion you provide me at a time, should not contain information about more than one thing.\n\n

        I want to have interactive learning with you on {course} course, topic: {topic}.
        Teach me that topic with simple step by step examples that even 2nd grade kids can understand.
        After that, please:
        1. Ask me a question to assess my level of understanding,
        2. Wait for my answer,
        3. Based on my answer, if my score isn’t good, give me a clearer explanation on the topic with more kid grade level examples until I understand the concept.
        4. Once I understand the concept, move on to the next concept of the topic. 

        While Asking Questions, Markdown properly, please keep it bold and different font style, so that i can understand it properly. 

        Note: do not wish me as a young learner.

        Current conversation: {{history}}
        Human: {{input}}
        Help Assistant:
        """

        PROMPT = PromptTemplate(
            input_variables=["history", "input"],
            template=template
        )

        help_chain = ConversationChain(
            llm=self.llm,
            prompt=PROMPT,
            verbose=False,
            memory=ConversationBufferMemory(ai_prefix="Help Assistant", memory_key="history")
        )

        return help_chain
    
    def init_ai_teacher(self,course,topic):
        self.help_chain =  self.initialize_help_chain(course=course, topic=topic)  # Default initialization


    # def init_ai_teacher(self,course,topic):
    #     self.ai_teacher = self.teach_me(course=course, topic=topic)


    def ask_ai_teacher(self,user_input):
        result = self.help_chain.predict(input=user_input)
        return result