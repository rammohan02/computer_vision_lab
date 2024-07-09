# -*- coding: utf-8 -*-
"""
Created on Fri Aug 20 19:33:30 2021

@author: rammo
"""

import numpy as np

print("Enter the degree of polymonials: ",  end=" ");
degree = int(input())

poly1 = []
poly2 = []

print("Enter the coefficients of polynomial 1 starting from 0 to n seperated by a space(if there any null terms put 0)", end=" ")
poly1 = list(map(int, input().split()))[:degree+1]

print("Enter the coefficients of polynomial 2 starting from 0 to n seperated by a space(if there any null terms put 0)", end=" ")
poly2 = list(map(int, input().split()))[:degree+1]

if(len(poly1)!=len(poly2)):
    print("Enter both the polynomials of same degree(if there any null terms put 0)")
else:
    print(poly1)
    print(poly2)
    
    conv_matrix = np.zeros(shape=(degree+1, degree+1))
    
    for i in range(degree+1):
        for j in range(degree+1):
            conv_matrix[i][j] = poly1[i] * poly2[j]
            
    ans = [0]*((2*degree)+1)
    """print(ans)"""
    for i in range(2*degree +1):
        for j in range(degree+1):
            if((i-j >=0) and (i-j < degree+1)):
                ans[i] = ans[i] + poly1[j]*poly2[i-j]
    print(ans)