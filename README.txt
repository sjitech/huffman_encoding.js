simple javascript code for huffman encoding

You can run in browser's console or node.js.

----------Using node.js----------
>>> node huffman_encoding.js < file_path

the result is same as later.


----------Using browser's console----------

paste all code from huffman_encoding.js, then you can type commands such as following:

>>> test_huffman_encode('emergency_call')

code	huffman_bit_str
----	---------------
101	01
99	101
108	100
95	000
97	0011
103	0010
109	1101
110	1100
114	1111
121	1110

result bit_len:45 old_bit_len:112 (treat old code unit as 8bits) compression rate:0.4017857142857143
total encoded message:
01 1101 01 1111 0010 01 1100 101    1110 000 101 0011 100 100

>>> make_huffman_code(/*frequency array*/[10, 1, 2, 3], /*debug:*/true)

code	huffman_bit_str
----	---------------
0	1
3	01
2	00
1	000

result bit_len:25 old_bit_len:128 (treat old code unit as 8bits) compression rate:0.1953125

>>> make_huffman_code(/*map of frequency for code*/{a:10, b:1, c:2, d:3}, /*debug:*/true)

code	huffman_bit_str
----	---------------
a	1
d	01
c	001
b	000

result bit_len:25 old_bit_len:128 (treat old code unit as 8bits) compression rate:0.1953125

