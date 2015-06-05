/**
 * General functions for creating dispenser objects.
 */
function nw(id, dispType) {
  return {id: id, width: dispType.width, height: dispType.height};
}

function ne(id, dispType) {
  return _.extend(nw(id, dispType), {end: true});
}

// 120A dispenser types
var w117h61 =  {width: 117, height: 61};
var w117h29 =  {width: 117, height: 29};

var backplane120A = {
  dispenserFlow: 'column',
  dispensers: [
    nw(1, w117h61),nw(9,  w117h61),nw(17, w117h61),nw(25, w117h61),nw(33, w117h61),nw(41, w117h29),nw(57, w117h29),nw(73, w117h29),nw(89, w117h29), nw(105, w117h29),
    nw(2, w117h61),nw(10, w117h61),nw(18, w117h61),nw(26, w117h61),nw(34, w117h61),nw(42, w117h29),nw(58, w117h29),nw(74, w117h29),nw(90, w117h29), nw(106, w117h29),
    nw(3, w117h61),nw(11, w117h61),nw(19, w117h61),nw(27, w117h61),nw(35, w117h61),nw(43, w117h29),nw(59, w117h29),nw(75, w117h29),nw(91, w117h29), nw(107, w117h29),
    nw(4, w117h61),nw(12, w117h61),nw(20, w117h61),nw(28, w117h61),nw(36, w117h61),nw(44, w117h29),nw(60, w117h29),nw(76, w117h29),nw(92, w117h29), nw(108, w117h29),
    nw(5, w117h61),nw(13, w117h61),nw(21, w117h61),nw(29, w117h61),nw(37, w117h61),nw(45, w117h29),nw(61, w117h29),nw(77, w117h29),nw(93, w117h29), nw(109, w117h29),
    nw(6, w117h61),nw(14, w117h61),nw(22, w117h61),nw(30, w117h61),nw(38, w117h61),nw(46, w117h29),nw(62, w117h29),nw(78, w117h29),nw(94, w117h29), nw(110, w117h29),
    nw(7, w117h61),nw(15, w117h61),nw(23, w117h61),nw(31, w117h61),nw(39, w117h61),nw(47, w117h29),nw(63, w117h29),nw(79, w117h29),nw(95, w117h29), nw(111, w117h29),
    ne(8, w117h61),ne(16, w117h61),ne(24, w117h61),ne(32, w117h61),ne(40, w117h61),nw(48, w117h29),nw(64, w117h29),nw(80, w117h29),nw(96, w117h29), nw(112, w117h29),
                                                                                   nw(49, w117h29),nw(65, w117h29),nw(81, w117h29),nw(97, w117h29), nw(113, w117h29),
                                                                                   nw(50, w117h29),nw(66, w117h29),nw(82, w117h29),nw(98, w117h29), nw(114, w117h29),
                                                                                   nw(51, w117h29),nw(67, w117h29),nw(83, w117h29),nw(99, w117h29), nw(115, w117h29),
                                                                                   nw(52, w117h29),nw(68, w117h29),nw(84, w117h29),nw(100, w117h29),nw(116, w117h29),
                                                                                   nw(53, w117h29),nw(69, w117h29),nw(85, w117h29),nw(101, w117h29),nw(117, w117h29),
                                                                                   nw(54, w117h29),nw(70, w117h29),nw(86, w117h29),nw(102, w117h29),nw(118, w117h29),
                                                                                   nw(55, w117h29),nw(71, w117h29),nw(87, w117h29),nw(103, w117h29),nw(119, w117h29),
                                                                                   ne(56, w117h29),ne(72, w117h29),ne(88, w117h29),ne(104, w117h29),ne(120, w117h29)
  ]
};

//console.log(backplane120A);
//_.each(backplane120A.dispensers, function(disp) {
//  console.log(disp);
//});

// 50A dispenser types
var w115h45 =  {width: 115, height: 45};
var w156h45 =  {width: 156, height: 45};
var w115h75 =  {width: 115, height: 75};
var w156h75 =  {width: 156, height: 75};
var w156h85 =  {width: 156, height: 85};
var w232h85 =  {width: 232, height: 85};
var w156h133 = {width: 156, height: 133};
var w232h133 = {width: 232, height: 133};

var backplane50A = {
  dispenserFlow: 'row',
  dispensers: [
    nw(1,  w156h45), nw(2,  w156h45), nw(3,  w156h45), nw(4,  w156h45), nw(5,  w115h45), nw(6,  w115h45), nw(7,  w115h45), ne(8,  w115h45),
    nw(9,  w156h75), nw(10, w156h75), nw(11, w156h75), nw(12, w156h75), nw(13, w115h75), nw(14, w115h75), nw(15, w115h75), ne(16, w115h75),
    nw(17, w156h45), nw(18, w156h45), nw(19, w156h45), nw(20, w156h45), nw(21, w115h45), nw(22, w115h45), nw(23, w115h45), ne(24, w115h45),
    nw(25, w156h75), nw(26, w156h75), nw(27, w156h75), nw(28, w156h75), nw(29, w115h75), nw(30, w115h75), nw(31, w115h75), ne(32, w115h75),
    nw(33, w156h45), nw(34, w156h45), nw(35, w156h45), nw(36, w156h45), nw(37, w115h45), nw(38, w115h45), nw(39, w115h45), ne(40, w115h45),
    nw(41, w156h85), nw(42, w232h85), nw(43, w232h85), nw(44, w232h85), ne(45, w232h85),
    nw(46, w156h133),nw(47, w232h133),nw(48, w232h133),nw(49, w232h133),ne(50, w232h133)
  ]
};
