#!/usr/bin/env python
# coding: utf-8

# In[1]:

#for image processing
import cv2

#for opening the filebox
import easygui

#for storing the image
import numpy as np

#for reading image stored at a particular path
import imageio


# In[2]:


import sys
import matplotlib.pyplot as plt
import os
import tkinter as tk
from tkinter import filedialog
from tkinter import *
from PIL import ImageTk, Image


# In[3]:

# Making main window

top=tk.Tk()
top.geometry('500x500')
top.title('Cartoonify your Image')
top.configure(background='white')
label=Label(top,background='#CDCDCD', font=('calibri',24,'bold'))


# In[4]:


""" fileopenbox opens a box to select a file and store file path as a string """
def upload():
    ImgPath=easygui.fileopenbox()
    cartoonify(ImgPath)


# In[5]:


# Read the image
def cartoonify(ImgPath):
    orgimage = cv2.imread(ImgPath)
    orgimage = cv2.cvtColor(orgimage, cv2.COLOR_BGR2RGB)
    # image is stored in form of numbers
    
    # confirm that image is chosen
    if orgimage is None:
        print("Can not find any image, Choose an appropriate file")
        sys.exit()

    ReSize1 = cv2.resize(orgimage, (940,610))
    
    #converting an image to grayscale
    grayScaleImg= cv2.cvtColor(orgimage, cv2.COLOR_BGR2GRAY)
    ReSize2 = cv2.resize(grayScaleImg, (940,610))

    #applying median blur to smoothen an image
    smoothImg = cv2.medianBlur(grayScaleImg, 5)
    ReSize3 = cv2.resize(smoothImg, (940,610))
    
    #retrieving the edges by using thresholding technique
    Edge = cv2.adaptiveThreshold(smoothImg, 255, cv2.ADAPTIVE_THRESH_MEAN_C, 
                                    cv2.THRESH_BINARY, 9, 9)

    ReSize4 = cv2.resize(Edge, (940,610))
   
    #applying bilateral filter to remove noise and keep edges sharp
    colorImg = cv2.bilateralFilter(orgimage, 9, 300, 300)
    ReSize5 = cv2.resize(colorImg, (940,610))
  
    #masking edged image with color image
    cartoonImg = cv2.bitwise_and(colorImg, colorImg, mask=Edge)

    ReSize6 = cv2.resize(cartoonImg, (940,610))
   
    # Plotting the whole transition
    images=[ReSize1, ReSize2, ReSize3, ReSize4, ReSize5, ReSize6]

    fig, axis = plt.subplots(3,2, figsize=(8,8), subplot_kw={'xticks':[], 'yticks':[]}, gridspec_kw=dict(hspace=0.1, wspace=0.1))
    for i, x in enumerate(axis.flat):
        x.imshow(images[i], cmap='gray')
        
    # Make save button in main window
    save1=Button(top,text="Save Cartoon Image",command=lambda: save(ReSize6, ImgPath),padx=30,pady=5)
    save1.configure(background='#364156', foreground='white',font=('times new roman',20,'bold'))
    save1.pack(side=TOP,pady=50)
    
    plt.show()


# In[6]:


# Function for creating the save button
    
def save(ReSize6, ImgPath):
    
    #saving an image using imwrite()
    new="cartoon_image"
    Imgpath1 = os.path.dirname(ImgPath)
    extension=os.path.splitext(ImgPath)[1]
    path = os.path.join(Imgpath1, new+extension)
    cv2.imwrite(path, cv2.cvtColor(ReSize6, cv2.COLOR_RGB2BGR))
    M= "Image saved by name " + new +" at "+ path
    tk.messagebox.showinfo(title="ImageSaved", message=M)


# In[ ]:


# Making Cartoonify an Image button in the main window

upload=Button(top,text="Cartoonify an Image",command=upload,padx=10,pady=5)
upload.configure(background='#364156', foreground='white',font=('times new roman',20,'bold'))
upload.pack(side=TOP,pady=50)

# Main function to build the tkinter window

top.mainloop()

