'use strict';

/**
 * given map {code: freq}, produce huffman code map {code: new code}
 * @param freq_ary
 * sample: [10, 2, 3]
 * sample: {a: 10, b: 2, c: 3}
 * @returns encoded_bit_str map of code
 * sample: {a:{bit_str:'01', freq:10}, b:{bit_str:'010', freq:2}, c:{bit_str:'101', freq:3}}
 */
function make_huffman_code(freq_ary, debug) {
  var code_ary = Object.keys(freq_ary);

  var huff_code_map = {/*key:old code value, value:new code bit string*/};
  if (!code_ary.length) return {};
  if (code_ary.length === 1) {
    huff_code_map[code_ary[0]] = {bit_str: '0', freq: 1};
    return huff_code_map;
  }

  //add all node to node array
  var node_ary = [];
  code_ary.forEach(function (code) {
    node_ary.push({freq: freq_ary[code], code: code});
  });

  while (node_ary.length >= 2) {
    //sort reversely
    node_ary.sort(function (node_a, node_b) {
      return node_b.freq - node_a.freq;
    });
    //combine two minimum frequency's codes to a new node, replace them with the combined node
    var node1 = node_ary[node_ary.length - 1];
    var node2 = node_ary[node_ary.length - 2];
    node_ary[node_ary.length - 2] = {freq: node1.freq + node2.freq, child_nodes: [node1, node2]};
    node_ary.length--;
  }
  //finally, node_ary will contains only one combined node which have total frequency.
  node_ary[0].bit_str = '';
  set_bit_str(node_ary[0]);
  //if (debug) console.log('huffman tree: ' + JSON.stringify(last_node, null, '    '));

  //----------------begin debug, you can remove this block----------------
  if (debug) {
    code_ary.sort(function (code1, code2) {
      return freq_ary[code2] - freq_ary[code1];
    });
    var new_bit_len = 0, old_byte_len = 0;
    console.log('code\thuffman_bit_str\n----\t---------------');
    code_ary.forEach(function (code) {
      console.log('' + code + '\t' + huff_code_map[code].bit_str);
      new_bit_len += freq_ary[code] * huff_code_map[code].bit_str.length;
      old_byte_len += freq_ary[code];
    });
    console.log('\nresult bit_len:' + new_bit_len + ' old_bit_len:' + (old_byte_len * 8) + ' (treat old code unit as 8bits) compression rate:' + (new_bit_len / (old_byte_len * 8)));
  }
  //----------------end  debug, you can remove this block----------------

  return huff_code_map;

  function set_bit_str(node) {
    if (node.child_nodes) {
      node.child_nodes[0].bit_str = node.bit_str + '0';
      node.child_nodes[1].bit_str = node.bit_str + '1';
      set_bit_str(node.child_nodes[0]);
      set_bit_str(node.child_nodes[1]);
    } else {
      huff_code_map[node.code] = {bit_str: node.bit_str, freq: node.freq};
    }
  }
}

/**
 * extract all unique codes and their frequency.
 * @param msg:  any array-like object (e.x. string, Buffer)
 * @returns freq map of code
 * sample: {a: 10, b: 2, c: 3}
 */
function extract_code_freq_map(msg/*string/buffer/int_array/*/) {
  var freq_map = {};
  Array.prototype.forEach.call(msg, function (code) {
    freq_map[code] = (freq_map[code] || 0) + 1;
  });
  return freq_map;
}

/**
 * test
 * @param msg:  any array-like object (e.x. string, Buffer)
 */
function test_huffman_encode(msg/*buffer/int_array/string*/) {
  var huffman_code_map = make_huffman_code(extract_code_freq_map(msg), /*debug:*/true);
  console.log('total encoded message:');
  var s = '', cnt = 0;
  Array.prototype.forEach.call(msg, function (code) {
    ++cnt;
    s = (cnt % 16 === 1 ? '' : s) + huffman_code_map[code].bit_str + (cnt % 8 === 0 ? '    ' : ' ');
    if (cnt % 16 === 0)
      console.log(s);
  });
  if (cnt < 16) console.log(s);
}


//test from node.js, skipped in browser
try {
  var buf_ary = [];
  process.stdin.on('data', function (buf) {
    buf_ary.push(buf);
  });
  process.stdin.on('end', function () {
    var buf = Buffer.concat(buf_ary);
    if (buf[buf.length - 1] === 0xa) {
      buf = buf.slice(0, buf.length - (buf[buf.length - 2] === 0xd ? 2 : 1));
    }
    test_huffman_encode(buf);
  });
} catch (e) {
}
