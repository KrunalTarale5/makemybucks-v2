"use strict";(self.webpackChunkrich_penny_frontend=self.webpackChunkrich_penny_frontend||[]).push([[703],{9703:(e,a,n)=>{n.r(a),n.d(a,{default:()=>E});var t=n(4877),i=n(7758),o=n(4710),r=n(2757),l=n(331),s=n(9891),d=n(8095),c=n(4857),u=n(3230),v=n(4616),m=n(6986),h=n(5546),p=n(249),g=n(2610),x=n(5333),A=n(4745),C=n(6583),j=n(33),y=n(8170),f=n(9950),b=n(4414);const k=["Veg Restaurant","Non Veg Restaurant","South Indian Restaurant","Chinese Restaurant"],w=()=>{var e,a,n,i,d,p,g,x;const A=(0,c.A)();(0,l.o)(l.L.masterList);const{showSnackbar:C,hideSnackbar:j}=(0,o.dh)(),y=(0,s.tc)(),k=(0,s.Au)(),w=(0,s.Li)(),E=(0,s.Cf)(),S=(0,s.Tz)(),I=(0,s.kI)(),D=(0,s.ug)(),R=(0,s.NI)(),L=(0,s.eI)(),N=(0,s.T8)(),P=(0,s.ms)(),q=(0,s.bG)(),G=(0,s.sw)(),B=(0,s.ln)(),z=(0,s.w4)(),F=(0,s.x6)(),U=(0,s.qf)(),M=(0,s.f1)(),[O,W]=(0,f.useState)(!1),[V,H]=(0,f.useState)(null),[X,J]=(0,f.useState)(!1),K=e=>(a,n)=>{J(!!n&&e)};return(0,b.jsxs)(u.A,{gap:5,paddingBottom:3,children:[(0,b.jsx)(r.j3,{variant:"h5",sx:{color:A.palette.common.primaryGreyText},children:"All Master List"}),(0,b.jsxs)(u.A,{gap:2,children:[(0,b.jsxs)(v.A,{TransitionProps:{unmountOnExit:!0},expanded:"Restaurant List"===X,onChange:K("Restaurant List"),children:[(0,b.jsx)(m.A,{expandIcon:(0,b.jsx)(t.A,{iconName:"CircleArrowDown"}),children:(0,b.jsx)(r.j3,{variant:"h6",sx:{color:A.palette.common.primaryGreyText},children:"Restaurant List"})}),(0,b.jsx)(h.A,{children:(0,b.jsxs)(u.A,{flexBasis:"25%",flexDirection:"row",gap:10,children:[(0,b.jsx)(_,{heading:"Restaurant Type",onAddClick:()=>W("Restaurant Type"),onEditItemClick:e=>H({item:e,type:"Restaurant Type"}),data:null===(e=y.data)||void 0===e?void 0:e.data.restaurantTypeData.map((e=>({label:e.type_name,value:e.id})))}),(0,b.jsx)(_,{heading:"Cuisine Type",onAddClick:()=>W("Cuisine Type"),onEditItemClick:e=>H({item:e,type:"Cuisine Type"}),data:null===(a=k.data)||void 0===a?void 0:a.data.cuisineData.map((e=>({label:e.cuisine_name,value:e.id})))})]})})]}),(0,b.jsxs)(v.A,{TransitionProps:{unmountOnExit:!0},expanded:"Sub Admin List"===X,onChange:K("Sub Admin List"),children:[(0,b.jsx)(m.A,{expandIcon:(0,b.jsx)(t.A,{iconName:"CircleArrowDown"}),children:(0,b.jsx)(r.j3,{variant:"h6",sx:{color:A.palette.common.primaryGreyText},children:"Sub Admin List"})}),(0,b.jsx)(h.A,{children:(0,b.jsxs)(u.A,{flexBasis:"25%",flexDirection:"row",gap:10,children:[(0,b.jsx)(_,{heading:"Agreement Period",onAddClick:()=>W("Agreement Period"),onEditItemClick:e=>H({item:e,type:"Agreement Period"}),data:null===(n=w.data)||void 0===n?void 0:n.data.onbordingPeriodsData.map((e=>({label:e.period,value:e.id})))}),(0,b.jsx)(_,{heading:"Assign Location",onAddClick:()=>W("Assign Location"),onEditItemClick:e=>H({item:e,type:"Assign Location"}),data:null===(i=E.data)||void 0===i?void 0:i.data.onbordingLocationData.map((e=>({label:e.location_name,value:e.id})))})]})})]}),(0,b.jsxs)(v.A,{TransitionProps:{unmountOnExit:!0},expanded:"Notifications"===X,onChange:K("Notifications"),children:[(0,b.jsx)(m.A,{expandIcon:(0,b.jsx)(t.A,{iconName:"CircleArrowDown"}),children:(0,b.jsx)(r.j3,{variant:"h6",sx:{color:A.palette.common.primaryGreyText},children:"Notifications"})}),(0,b.jsx)(h.A,{children:(0,b.jsxs)(u.A,{flexBasis:"25%",flexDirection:"row",gap:10,children:[(0,b.jsx)(_,{heading:"Notification Category",onAddClick:()=>W("Notification Category"),onEditItemClick:e=>H({item:e,type:"Notification Category"}),data:null===(d=S.data)||void 0===d?void 0:d.data.categoryData.map((e=>({label:e.message_category,value:e.msg_category_id})))}),(0,b.jsx)(_,{heading:"Document Rejection",onAddClick:()=>W("Document Rejection"),onEditItemClick:e=>H({item:e,type:"Document Rejection"}),data:null===(p=I.data)||void 0===p||null===(g=p.data.reject_reason_data)||void 0===g?void 0:g.map((e=>({label:e.reject_reason,value:e.id.toString()})))})]})})]})]}),(0,b.jsx)(T,{heading:null!==(x=null===V||void 0===V?void 0:V.type)&&void 0!==x?x:O,loading:D.isLoading||G.isLoading,updateItem:null===V||void 0===V?void 0:V.item,handleClose:()=>{W(!1),H(null)},onAddClick:(e,a)=>{switch(e){case"Restaurant Type":D.mutateAsync({request:{type_name:a}}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),W(!1),y.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Cuisine Type":R.mutateAsync({request:{cuisine_name:a}}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),W(!1),k.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Agreement Period":L.mutateAsync({request:{period:a}}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),W(!1),w.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Assign Location":N.mutateAsync({request:{location:a}}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),W(!1),E.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Notification Category":P.mutateAsync({request:{message_category:a}}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),W(!1),S.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Document Rejection":q.mutateAsync({request:{reject_reason:a}}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),W(!1),S.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}))}},onUpdateClick:(e,a)=>{switch(e){case"Restaurant Type":G.mutateAsync({request:{new_type_name:a.label},id:a.value}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),H(null),y.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Cuisine Type":B.mutateAsync({request:{new_cuisine_name:a.label},id:a.value}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),H(null),k.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Agreement Period":z.mutateAsync({request:{new_period_name:a.label},id:a.value}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),H(null),w.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Assign Location":F.mutateAsync({request:{new_location:a.label},id:a.value}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),H(null),E.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Notification Category":U.mutateAsync({request:{new_message_category:a.label},id:a.value}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),H(null),S.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}));break;case"Document Rejection":M.mutateAsync({request:{new_reject_reason:a.label},id:a.value}).then((e=>{var a;C({title:"Success!",variant:"sucess",content:null===(a=e.data)||void 0===a?void 0:a.message,onCancel:()=>j()}),H(null),S.refetch()})).catch((e=>{var a,n;C({title:"Error!",variant:"error",content:null===(a=e.response)||void 0===a||null===(n=a.data)||void 0===n?void 0:n.message,onCancel:()=>j()})}))}}})]})},E=(0,f.memo)(w),_=(0,f.memo)((e=>{var a,n;const i=(0,c.A)();return(0,b.jsxs)(u.A,{gap:2,width:"25%",children:[(0,b.jsxs)(r.j3,{variant:"subtitle1",sx:{color:i.palette.common.primaryGreyText},children:[e.heading," (",null===(a=e.data)||void 0===a?void 0:a.length,")"]}),(0,b.jsx)(p.A,{sx:{borderRadius:"8px !important",borderWidth:1,borderStyle:"solid",borderColor:"#DFE3ED",backgroundColor:"#F3F4F8",maxHeight:200,overflow:"auto"},children:null===(n=e.data)||void 0===n?void 0:n.map(((a,n)=>(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(g.Ay,{alignItems:"flex-start",secondaryAction:(0,b.jsx)(x.A,{edge:"end",size:"small",onClick:n=>{var t;return null===(t=e.onEditItemClick)||void 0===t?void 0:t.call(e,a,n)},children:(0,b.jsx)(t.A,{iconName:"Pen",iconProps:{width:20,height:20,fill:i.palette.common.primaryGreyText}})}),children:(0,b.jsx)(r.j3,{variant:"subtitle1",children:a.label})}),k.length!==n+1&&(0,b.jsx)(A.A,{variant:"inset",component:"li",sx:{borderColor:"#DFE3ED",marginX:2}})]})))}),(null===e||void 0===e?void 0:e.onAddClick)&&(0,b.jsx)(d.A,{size:"large",variant:"outlined",color:"inherit",startIcon:(0,b.jsx)(t.A,{iconName:"Add",iconProps:{fill:i.palette.common.secondaryGreyText}}),sx:{borderColor:i.palette.common.secondaryGreyText,alignSelf:"self-start"},onClick:e.onAddClick,children:(0,b.jsx)(r.j3,{variant:"subtitle2",children:"Add New"})})]})})),T=e=>{const a=(0,c.A)(),[n,t]=(0,f.useState)("");return(0,f.useEffect)((()=>{var a,n;t(null!==(a=null===(n=e.updateItem)||void 0===n?void 0:n.label)&&void 0!==a?a:"")}),[e.updateItem]),(0,f.useEffect)((()=>{e.heading||t("")}),[Boolean(e.heading)]),(0,b.jsxs)(C.A,{onClose:e.handleClose,open:Boolean(e.heading),maxWidth:"sm",sx:{".MuiPaper-root":{width:"100%"}},children:[(0,b.jsx)(j.A,{sx:{padding:4,paddingBottom:3},children:(0,b.jsxs)(r.j3,{variant:"h4",sx:{color:a.palette.common.primaryGreyText},children:[e.updateItem?"Update":"Add"," ",e.heading]})}),(0,b.jsxs)(y.A,{sx:{display:"flex",flexDirection:"column",gap:6,padding:4},children:[(0,b.jsx)(i.A,{fieldName:"add",value:n,fieldProps:{placeholder:"Type here to add",fullWidth:!0,size:"medium",sx:{".MuiInputBase-root":{borderRadius:"8px"}}},onChange:(e,a)=>{t(a)}}),(0,b.jsxs)(u.A,{flexDirection:"row",gap:2,alignSelf:"self-end",children:[(0,b.jsx)(d.A,{variant:"outlined",size:"large",sx:{width:166},onClick:e.handleClose,children:(0,b.jsx)(r.j3,{variant:"h5",sx:{color:a.palette.common.primaryGreyText},children:"Cancel"})}),e.updateItem?(0,b.jsx)(d.A,{variant:"contained",size:"large",sx:{width:166},loading:e.loading,onClick:a=>{var t,i,o;return null===(t=e.onUpdateClick)||void 0===t?void 0:t.call(e,e.heading,{value:null!==(i=null===(o=e.updateItem)||void 0===o?void 0:o.value)&&void 0!==i?i:"",label:n},a)},children:(0,b.jsx)(r.j3,{variant:"h5",children:"Update"})}):(0,b.jsx)(d.A,{variant:"contained",size:"large",sx:{width:166},loading:e.loading,onClick:a=>{var t;return null===(t=e.onAddClick)||void 0===t?void 0:t.call(e,e.heading,n,a)},children:(0,b.jsx)(r.j3,{variant:"h5",children:"Add"})})]})]})]})}}}]);