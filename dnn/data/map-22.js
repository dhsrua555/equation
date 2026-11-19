/* 논리 지도 — 22 선형 어텐션과 비전 트랜스포머. 셀프 어텐션의 O(N²) 비용에서 출발해 유사도로 다시 쓰기와 선형 어텐션으로 가는 길,
   정규화의 묶음에서 ViT와 GELU로 가는 길, 이미지 토큰의 비용을 세어 윈도우 어텐션으로 가는 길을 그립니다. */
window.EM = window.EM || { chapters: [], exams: [] };
EM.maps = EM.maps || [];
(function () {
  const R = String.raw;
  EM.maps.push({
    n: 22,
    easy: R`
셀프 어텐션은 토큰 $N$개가 서로를 모두 보므로 $N\times N$ 행렬을 만들고, 시간과 메모리가 $N^2$에 비례합니다. 소프트맥스를 풀어 쓰면 어텐션은 **유사도로 가중한 평균**이고, 유사도가 지수 함수일 필요는 없습니다. 유사도를 특성 사상의 내적 $\phi(\mathbf q)^T\phi(\mathbf k)$로 바꾸면 곱하는 순서를 바꿀 수 있어서, 모든 질의가 함께 쓰는 요약 $S$, $Z$를 한 번만 만들면 되는 **선형 어텐션**이 됩니다.

트랜스포머를 이미지에 쓰려면 이미지를 토큰으로 바꿔야 합니다. **ViT**는 이미지를 패치로 잘라 펼치고 선형 사상과 위치 임베딩, 클래스 토큰을 붙여 인코더에 넣습니다. 이때 쓰는 LN은 토큰 하나의 특징만으로 정규화해 배치와 무관하고, MLP의 활성화는 매끄러운 GELU입니다. ViT는 CNN보다 이미지에 대한 가정이 약해 자료가 많아야 빛을 봅니다.

이미지는 토큰이 많습니다. 행렬 곱의 비용 $mnk$로 세면 한 층이 $4NC^2+2N^2C$이고, $56\times56$ 격자에서는 어텐션 항이 거의 전부입니다. Swin은 $M\times M$ **창 안에서만** 어텐션해 이 항을 $2NM^2C$로 줄이고, 비용이 $N$에 선형이 됩니다.`,
    easyEn: R`
Self-attention lets all $N$ tokens look at one another, so it builds an $N\times N$ matrix and its time and memory grow like $N^2$. Expanding the softmax shows attention is a **similarity-weighted average**, and the similarity need not be the exponential. Replacing it with an inner product of feature maps, $\phi(\mathbf q)^T\phi(\mathbf k)$, lets us change the order of multiplication, giving **linear attention**, which only needs to build once the summaries $S$ and $Z$ that all queries share.

To use a Transformer on images, the image must become tokens. **ViT** cuts the image into patches, flattens them, and adds a linear map, position embeddings, and a class token before the encoder. Its LN normalizes with the features of one token only, independent of the batch, and the MLP activation is the smooth GELU. ViT assumes less about images than a CNN, so it shines only with plenty of data.

Images have many tokens. Counting with the matrix-product cost $mnk$, one layer costs $4NC^2+2N^2C$, and on a $56\times56$ grid the attention term is nearly everything. Swin attends **only inside $M\times M$ windows**, cutting this term to $2NM^2C$, and the cost becomes linear in $N$.`,
    nodes: [
      { id: 'cost', role: 'q', k: '22.1', t: R`$O(N^2)$를 줄이려면?`, en: R`How to cut the $O(N^2)$?`,
        d: R`셀프 어텐션은 $N\times N$ 행렬 $A$를 저장하는 데 $O(N^2)$ 메모리, $AV$에 $O(N^2)$ 시간이 듭니다(슬라이드 12 “Linearization of TF”).`,
        dEn: R`Self-attention needs $O(N^2)$ memory to store the $N\times N$ matrix $A$ and $O(N^2)$ time for $AV$ (slide 12, “Linearization of TF”).` },
      { id: 'sim', role: 'idea', k: '22.1', at: ':::key 유사도로 쓴 소프트맥스 어텐션', t: R`유사도의 가중 평균`, en: R`A similarity-weighted average`,
        d: R`소프트맥스의 분모를 꺼내면 $\hat{\mathbf v}_i=\sum\mathrm{sim}\,\mathbf v_j/\sum\mathrm{sim}$, $\mathrm{sim}=\exp(\mathbf q^T\mathbf k/\sqrt D)$. 필요한 것은 양의 유사도뿐입니다.`,
        dEn: R`Pulling out the softmax denominator gives $\hat{\mathbf v}_i=\sum\mathrm{sim}\,\mathbf v_j/\sum\mathrm{sim}$ with $\mathrm{sim}=\exp(\mathbf q^T\mathbf k/\sqrt D)$. All that is needed is a positive similarity.` },
      { id: 'lin', role: 'res', k: '22.2', at: ':::key 선형 어텐션', t: R`선형 어텐션 $S^T\phi(\mathbf q)/\phi(\mathbf q)^TZ$`, en: R`Linear attention $S^T\phi(\mathbf q)/\phi(\mathbf q)^TZ$`,
        d: R`$\mathrm{sim}=\phi(\mathbf q)^T\phi(\mathbf k)$ ($\phi=\mathrm{ELU}+1$)이면 $\phi(\mathbf q_i)$를 합 밖으로 꺼내 $S$, $Z$를 한 번만 만듭니다. 시간 $O(Nrd_v)$, 계수 $r$ 이하의 근사입니다.`,
        dEn: R`With $\mathrm{sim}=\phi(\mathbf q)^T\phi(\mathbf k)$ ($\phi=\mathrm{ELU}+1$), $\phi(\mathbf q_i)$ comes out of the sum and $S$, $Z$ are built once. Time $O(Nrd_v)$, an approximation of rank at most $r$.` },
      { id: 'norm', role: 'view', k: '22.3', at: ':::key 정규화 통계를 모으는 묶음', t: R`정규화의 세 묶음`, en: R`Three groupings for normalization`,
        d: R`BN은 채널마다 배치·위치 전체, CNN의 LN은 샘플 하나 전체, 트랜스포머의 LN은 토큰 하나의 특징에서 평균과 분산을 구합니다.`,
        dEn: R`BN takes the mean and variance per channel over the batch and positions, the CNN LN over one whole sample, and the Transformer LN over the features of one token.` },
      { id: 'vit', role: 'app', k: '22.4', at: ':::key 비전 트랜스포머의 식', t: R`ViT: 패치를 토큰으로`, en: R`ViT: patches as tokens`,
        d: R`패치를 펼쳐 $E$로 사상하고 클래스 토큰과 $E_{pos}$를 붙여 Pre-LN 인코더 $L$개에 넣고, $\mathrm{LN}(\mathbf z_L^0)$로 분류합니다.`,
        dEn: R`Patches are flattened and mapped by $E$, a class token and $E_{pos}$ are added, $L$ Pre-LN encoder blocks follow, and $\mathrm{LN}(\mathbf z_L^0)$ is classified.` },
      { id: 'gelu', role: 'tool', k: '22.5', at: ':::key GELU', t: R`GELU와 약한 귀납 편향`, en: R`GELU and a weak inductive bias`,
        d: R`MLP의 활성화 $x\Phi(x)$는 매끄럽고 음수 쪽에 작은 골이 있습니다. ViT는 국소성 가정이 없어 작은 자료에서는 CNN에 뒤지고 큰 자료에서 앞섭니다.`,
        dEn: R`The MLP activation $x\Phi(x)$ is smooth with a small dip on the negative side. Without a locality assumption ViT trails CNNs on small data and leads on large data.` },
      { id: 'matcost', role: 'tool', k: '22.6', at: ':::key 셀프 어텐션의 비용', t: R`한 층의 비용 $4NC^2+2N^2C$`, en: R`Cost of one layer $4NC^2+2N^2C$`,
        d: R`행렬 곱은 $mnk$번. 투영 넷이 $4NC^2$, $QK^T$와 $AV$가 $2N^2C$이고, $N>2C$이면 어텐션 항이 지배합니다.`,
        dEn: R`A matrix product takes $mnk$. The four projections cost $4NC^2$, $QK^T$ and $AV$ cost $2N^2C$, and the attention term dominates when $N>2C$.` },
      { id: 'wmsa', role: 'fix', k: '22.7', at: ':::key 윈도우 어텐션의 비용', t: R`윈도우 어텐션 $4NC^2+2NM^2C$`, en: R`Window attention $4NC^2+2NM^2C$`,
        d: R`창 $N/M^2$개 각각에서 $2M^4C$. $M$, $C$를 고정하면 $O(N)$이고, $56\times56$, $M=7$에서 어텐션 항이 $64$배 줄어듭니다.`,
        dEn: R`$2M^4C$ in each of the $N/M^2$ windows. With $M$, $C$ fixed it is $O(N)$, and at $56\times56$, $M=7$ the attention term shrinks by $64$.` },
    ],
    rows: [['cost', 'norm'], ['sim', 'vit'], ['lin', 'gelu', 'matcost'], ['wmsa']],
    edges: [
      ['cost', 'sim', R`분모를 꺼내면`, R`pull out the denominator`],
      ['norm', 'vit', R`블록 앞에 LN`, R`LN before each block`],
      ['sim', 'lin', R`지수 대신 커널`, R`a kernel, not exp`],
      ['vit', 'gelu', R`MLP와 가정`, R`the MLP and assumptions`],
      ['vit', 'matcost', R`토큰이 많으면`, R`with many tokens`],
      ['matcost', 'wmsa', R`창 안에서만`, R`only inside windows`],
    ],
  });
})();
